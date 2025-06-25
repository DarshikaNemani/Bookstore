import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddressFormComponent } from '../../components/address-form/address-form.component';
import { HttpService } from '../../services/http.service';
import { CartService } from '../../services/cart.service';
import { OrderRequest, OrderItem, CartItem } from '../../services/models';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-order',
  imports: [
    AddressFormComponent,
    CommonModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit, OnDestroy {
  isLoading = false;
  cartItems: CartItem[] = [];
  orderItems: OrderItem[] = [];
  removingItems: Set<number> = new Set(); // Track which items are being removed
  updatingItems: Set<number> = new Set(); // Track which items are being updated

  private cartUpdateSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private httpService: HttpService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();

    // Subscribe to cart updates to refresh data when cart changes
    this.cartUpdateSubscription = this.cartService.cartUpdated$.subscribe(
      () => {
        console.log('Cart updated, refreshing order page...');
        this.loadCartItems();
      }
    );

    // Subscribe to route navigation to refresh when user comes back to this page
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/order') {
          console.log('Navigated to order page, refreshing cart...');
          this.loadCartItems();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.cartUpdateSubscription) {
      this.cartUpdateSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadCartItems(): void {
    this.isLoading = true;
    console.log('Loading cart items...');

    this.cartService.getCartItems().subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Cart items response:', response);

        if (response.success && response.result) {
          this.cartItems = response.result;
          console.log('Loaded cart items:', this.cartItems);

          // Log quantities for debugging
          this.cartItems.forEach((item, index) => {
            console.log(
              `Item ${index}: ${item.product_id.bookName} - Quantity: ${item.quantityToBuy}`
            );
          });

          this.convertCartToOrderItems();
        } else {
          console.error('Failed to load cart items:', response.message);
          this.cartItems = [];
          this.orderItems = [];
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading cart items:', error);
        this.cartItems = [];
        this.orderItems = [];
      },
    });
  }

  convertCartToOrderItems(): void {
    this.orderItems = this.cartItems.map((cartItem) => {
      const orderItem = {
        product_id: cartItem.product_id._id,
        product_name: cartItem.product_id.bookName,
        product_quantity: cartItem.quantityToBuy,
        product_price:
          cartItem.product_id.discountPrice || cartItem.product_id.price,
      };

      console.log(`Converting cart item to order item:`, {
        name: orderItem.product_name,
        quantity: orderItem.product_quantity,
        price: orderItem.product_price,
        total: orderItem.product_quantity * orderItem.product_price,
      });

      return orderItem;
    });

    console.log('Order items:', this.orderItems);
    console.log('Total price:', this.getTotalPrice());
  }

  // Add a manual refresh button for debugging
  refreshCart(): void {
    console.log('Manual refresh triggered');
    this.loadCartItems();
  }

  placeOrder(): void {
    if (this.orderItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Refresh cart items before placing order to ensure we have latest quantities
    this.loadCartItems();

    setTimeout(() => {
      this.isLoading = true;

      const orderRequest: OrderRequest = {
        orders: this.orderItems,
      };

      console.log('Placing order with:', orderRequest);

      this.httpService.placeOrder(orderRequest).subscribe({
        next: (response) => {
          console.log('Order placed successfully:', response);
          this.isLoading = false;
          // Clear cart after successful order
          this.clearCartAfterOrder();
          // Navigate to order success page
          this.router.navigate(['/order/success']);
        },
        error: (error) => {
          console.error('Error placing order:', error);
          this.isLoading = false;
          alert('Failed to place order. Please try again.');
        },
      });
    }, 500); // Small delay to ensure cart is refreshed
  }

  clearCartAfterOrder(): void {
    // Remove all items from cart after successful order using cart item IDs
    this.cartItems.forEach((cartItem) => {
      this.cartService.removeFromCart(cartItem._id).subscribe({
        next: (response) => console.log('Item removed from cart'),
        error: (error) =>
          console.error('Error removing item from cart:', error),
      });
    });
  }

  updateQuantity(index: number, newQuantity: number): void {
    if (index < 0 || index >= this.cartItems.length) {
      console.error('Invalid item index:', index);
      return;
    }

    const cartItem = this.cartItems[index];

    // Check constraints
    if (newQuantity < 1) {
      // If quantity would be less than 1, remove the item
      this.removeItem(index);
      return;
    }

    if (newQuantity > 10) {
      alert('Maximum 10 items allowed per product.');
      return;
    }

    if (newQuantity > cartItem.product_id.quantity) {
      alert('Cannot add more items. Stock limit reached.');
      return;
    }

    // Add to updating set to show loading state
    this.updatingItems.add(index);

    console.log(
      `Updating quantity for ${cartItem.product_id.bookName} from ${cartItem.quantityToBuy} to ${newQuantity}`
    );

    this.cartService.updateCartQuantity(cartItem._id, newQuantity).subscribe({
      next: (response) => {
        this.updatingItems.delete(index);
        console.log('Update quantity response:', response);

        if (response.success) {
          // Update local state immediately
          this.cartItems[index].quantityToBuy = newQuantity;
          this.convertCartToOrderItems();
          console.log(
            `Successfully updated quantity for "${cartItem.product_id.bookName}" to ${newQuantity}`
          );

          // Refresh cart items to ensure we have the latest data from server
          setTimeout(() => {
            this.loadCartItems();
          }, 100);
        } else {
          console.error('Update quantity failed:', response.message);
          alert(
            'Failed to update quantity: ' +
              (response.message || 'Unknown error')
          );
        }
      },
      error: (error) => {
        this.updatingItems.delete(index);
        console.error('Error updating quantity:', error);
        alert('Error updating quantity. Please try again.');
      },
    });
  }

  removeItem(index: number): void {
    if (index < 0 || index >= this.cartItems.length) {
      console.error('Invalid item index:', index);
      return;
    }

    const cartItem = this.cartItems[index];

    // Confirm before removing
    const confirmRemoval = confirm(
      `Are you sure you want to remove "${cartItem.product_id.bookName}" from your cart?`
    );
    if (!confirmRemoval) {
      return;
    }

    // Add to removing set to show loading state
    this.removingItems.add(index);

    console.log('Removing item from cart:', cartItem.product_id.bookName);

    // Use the cart item ID (_id) for deletion, not the product ID
    this.cartService.removeFromCart(cartItem._id).subscribe({
      next: (response) => {
        console.log('Remove from cart response:', response);
        this.removingItems.delete(index);

        if (response.success) {
          // Remove the item from local array
          this.cartItems.splice(index, 1);
          // Update order items
          this.convertCartToOrderItems();
          console.log(
            `Successfully removed "${cartItem.product_id.bookName}" from cart`
          );
        } else {
          console.error('Remove from cart failed:', response.message);
          alert(
            'Failed to remove item from cart: ' +
              (response.message || 'Unknown error')
          );
        }
      },
      error: (error) => {
        this.removingItems.delete(index);
        console.error('Error removing item from cart:', error);
        alert('Error removing item from cart. Please try again.');
      },
    });
  }

  // Helper methods to check loading states
  isItemBeingRemoved(index: number): boolean {
    return this.removingItems.has(index);
  }

  isItemBeingUpdated(index: number): boolean {
    return this.updatingItems.has(index);
  }

  getTotalPrice(): number {
    const total = this.orderItems.reduce(
      (total, item) => total + item.product_price * item.product_quantity,
      0
    );
    console.log('Calculated total price:', total);
    return total;
  }
}
