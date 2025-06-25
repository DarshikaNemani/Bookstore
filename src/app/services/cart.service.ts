import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'https://bookstore.incubation.bridgelabz.com/bookstore_user';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('authToken') || '';
    return {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };
  }

  addToCart(productId: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/add_cart_item/${productId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  updateCartQuantity(productId: string, quantityToBuy: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/cart_item_quantity/${productId}`,
      { quantityToBuy },
      { headers: this.getHeaders() }
    );
  }

  removeFromCart(productId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/remove_cart_item/${productId}`,
      { headers: this.getHeaders() }
    );
  }

  getCartItems(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/get_cart_items`,
      { headers: this.getHeaders() }
    );
  }
}