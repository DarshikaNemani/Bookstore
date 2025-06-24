import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddressFormComponent } from "../../components/address-form/address-form.component";
import { HttpService } from '../../services/http.service';
import { OrderRequest, OrderItem } from '../../services/models';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-order',
  imports: [AddressFormComponent, CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  isLoading = false;
  orderItems: OrderItem[] = [
    {
      product_id: "5f60c89223809243e2528781",
      product_name: "Don't Make Me Think",
      product_quantity: 1,
      product_price: 1500
    }
  ];

  constructor(
    private httpService: HttpService,
    private router: Router
  ) {}

  placeOrder(): void {
    this.isLoading = true;
    
    const orderRequest: OrderRequest = {
      orders: this.orderItems
    };

    this.httpService.placeOrder(orderRequest).subscribe({
      next: (response) => {
        console.log('Order placed successfully:', response);
        this.isLoading = false;
        // Navigate to order success page
        this.router.navigate(['/order/success']);
      },
      error: (error) => {
        console.error('Error placing order:', error);
        this.isLoading = false;
        // Handle error (show toast, alert, etc.)
        alert('Failed to place order. Please try again.');
      }
    });
  }

  updateQuantity(index: number, newQuantity: number): void {
    if (newQuantity > 0) {
      this.orderItems[index].product_quantity = newQuantity;
    }
  }

  removeItem(index: number): void {
    this.orderItems.splice(index, 1);
  }

  getTotalPrice(): number {
    return this.orderItems.reduce((total, item) => 
      total + (item.product_price * item.product_quantity), 0
    );
  }
}
