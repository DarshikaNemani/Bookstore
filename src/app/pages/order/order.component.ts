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
  removingItems: Set<number> = new Set();
  updatingItems: Set<number> = new Set();

  currentStep = 1;
  isCartCompleted = false;
  isAddressCompleted = false;

  private cartUpdateSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private httpService: HttpService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();

    this.cartUpdateSubscription = this.cartService.cartUpdated$.subscribe(
      () => {
        this.loadCartItems();
      }
    );

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.urlAfterRedirects === '/order') {
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

    this.cartService.getCartItems().subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success && response.result) {
          this.cartItems = response.result;
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
    this.orderItems = this.cartItems.map((cartItem) => ({
      product_id: cartItem.product_id._id,
      product_name: cartItem.product_id.bookName,
      product_quantity: cartItem.quantityToBuy,
      product_price:
        cartItem.product_id.discountPrice || cartItem.product_id.price,
    }));
  }

  proceedToAddress(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    this.isCartCompleted = true;
    this.currentStep = 2;
  }

  onAddressCompleted(): void {
    this.isAddressCompleted = true;
    this.currentStep = 3;
  }

  placeOrder(): void {
    if (this.orderItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.loadCartItems();

    setTimeout(() => {
      this.isLoading = true;

      const orderRequest: OrderRequest = {
        orders: this.orderItems,
      };

      this.httpService.placeOrder(orderRequest).subscribe({
        next: (response) => {
          console.log('Order placed successfully:', response);
          this.isLoading = false;
          this.clearCartAfterOrder();
          this.router.navigate(['/order/success']);
        },
        error: (error) => {
          console.error('Error placing order:', error);
          this.isLoading = false;
          alert('Failed to place order. Please try again.');
        },
      });
    }, 500);
  }

  clearCartAfterOrder(): void {
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

    if (newQuantity < 1) {
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

    this.updatingItems.add(index);

    this.cartService.updateCartQuantity(cartItem._id, newQuantity).subscribe({
      next: (response) => {
        this.updatingItems.delete(index);

        if (response.success) {
          this.cartItems[index].quantityToBuy = newQuantity;
          this.convertCartToOrderItems();

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

    const confirmRemoval = confirm(
      `Are you sure you want to remove "${cartItem.product_id.bookName}" from your cart?`
    );
    if (!confirmRemoval) {
      return;
    }

    this.removingItems.add(index);

    this.cartService.removeFromCart(cartItem._id).subscribe({
      next: (response) => {
        this.removingItems.delete(index);

        if (response.success) {
          this.cartItems.splice(index, 1);
          this.convertCartToOrderItems();
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

  isItemBeingRemoved(index: number): boolean {
    return this.removingItems.has(index);
  }

  isItemBeingUpdated(index: number): boolean {
    return this.updatingItems.has(index);
  }

  getTotalPrice(): number {
    return this.orderItems.reduce(
      (total, item) => total + item.product_price * item.product_quantity,
      0
    );
  }
}
