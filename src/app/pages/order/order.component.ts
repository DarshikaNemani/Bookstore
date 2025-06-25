import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddressFormComponent } from "../../components/address-form/address-form.component";
import { HttpService } from '../../services/http.service';
import { CartService } from '../../services/cart.service';
import { OrderRequest, OrderItem, CartItem } from '../../services/models';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-order',
  imports: [AddressFormComponent, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  isLoading = false;
  cartItems: CartItem[] = [];
  orderItems: OrderItem[] = [];

  constructor(
    private httpService: HttpService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
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
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading cart items:', error);
      }
    });
  }

  convertCartToOrderItems(): void {
    this.orderItems = this.cartItems.map(cartItem => ({
      product_id: cartItem.product_id._id,
      product_name: cartItem.product_id.bookName,
      product_quantity: cartItem.quantityToBuy,
      product_price: cartItem.product_id.discountPrice || cartItem.product_id.price
    }));
  }

  placeOrder(): void {
    if (this.orderItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    this.isLoading = true;
    
    const orderRequest: OrderRequest = {
      orders: this.orderItems
    };

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
      }
    });
  }

  clearCartAfterOrder(): void {
    // Remove all items from cart after successful order
    this.cartItems.forEach(cartItem => {
      this.cartService.removeFromCart(cartItem.product_id._id).subscribe({
        next: (response) => console.log('Item removed from cart'),
        error: (error) => console.error('Error removing item from cart:', error)
      });
    });
  }

  updateQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0 && index < this.cartItems.length) {
      const cartItem = this.cartItems[index];
      
      this.cartService.updateCartQuantity(cartItem.product_id._id, newQuantity).subscribe({
        next: (response) => {
          if (response.success) {
            this.cartItems[index].quantityToBuy = newQuantity;
            this.convertCartToOrderItems();
          }
        },
        error: (error) => {
          console.error('Error updating quantity:', error);
          alert('Failed to update quantity');
        }
      });
    }
  }

  removeItem(index: number): void {
    if (index < this.cartItems.length) {
      const cartItem = this.cartItems[index];
      
      this.cartService.removeFromCart(cartItem.product_id._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.cartItems.splice(index, 1);
            this.convertCartToOrderItems();
          }
        },
        error: (error) => {
          console.error('Error removing item:', error);
          alert('Failed to remove item');
        }
      });
    }
  }

  getTotalPrice(): number {
    return this.orderItems.reduce((total, item) => 
      total + (item.product_price * item.product_quantity), 0
    );
  }
}