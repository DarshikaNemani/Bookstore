import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-success',
  imports: [CommonModule],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.css'
})
export class OrderSuccessComponent {
  orderId = '#' + Math.floor(Math.random() * 1000000); // Generate random order ID

  constructor(private router: Router) {}

  continueShopping(): void {
    this.router.navigate(['/home']);
  }
}
