import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'https://bookstore.incubation.bridgelabz.com/bookstore_user';
  
  // Add a subject to notify about cart changes
  private cartUpdatedSubject = new BehaviorSubject<boolean>(false);
  public cartUpdated$ = this.cartUpdatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('authToken') || '';
    return {
      'Content-Type': 'application/json',
      'x-access-token': token,
    };
  }

  addToCart(productId: string): Observable<any> {
    console.log('Cart Service - Adding to cart:', productId);
    return this.http.post(
      `${this.baseUrl}/add_cart_item/${productId}`,
      {},
      { headers: this.getHeaders() }
    ).pipe(
      tap((response) => {
        console.log('Cart Service - Add to cart response:', response);
        this.notifyCartUpdate();
      })
    );
  }

  // Updated to use cart item ID instead of product ID
  updateCartQuantity(cartItemId: string, quantityToBuy: number): Observable<any> {
    const url = `${this.baseUrl}/cart_item_quantity/${cartItemId}`;
    const body = { quantityToBuy };
    const headers = this.getHeaders();
    
    console.log('Cart Service - Update quantity request:', {
      url,
      body,
      headers,
      cartItemId,
      quantityToBuy
    });
    
    return this.http.put(url, body, { headers }).pipe(
      tap((response) => {
        console.log('Cart Service - Update quantity response:', response);
        this.notifyCartUpdate();
      })
    );
  }

  removeFromCart(cartItemId: string): Observable<any> {
    const url = `${this.baseUrl}/remove_cart_item/${cartItemId}`;
    console.log('Cart Service - Remove from cart:', { url, cartItemId });
    
    return this.http.delete(url, { headers: this.getHeaders() }).pipe(
      tap((response) => {
        console.log('Cart Service - Remove from cart response:', response);
        this.notifyCartUpdate();
      })
    );
  }

  getCartItems(): Observable<any> {
    console.log('Cart Service - Getting cart items...');
    return this.http.get(
      `${this.baseUrl}/get_cart_items`,
      { headers: this.getHeaders() }
    ).pipe(
      tap((response) => {
        console.log('Cart Service - Get cart items response:', response);
      })
    );
  }

  // Method to notify all subscribers that cart has been updated
  private notifyCartUpdate(): void {
    console.log('Cart Service - Notifying cart update');
    this.cartUpdatedSubject.next(true);
  }
}