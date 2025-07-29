import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl =
    'https://bookstore-proxy-pearl.vercel.app/api/bookstore_user';

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
    return this.http
      .post(
        `${this.baseUrl}/add_cart_item/${productId}`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(tap(() => this.notifyCartUpdate()));
  }

  updateCartQuantity(
    cartItemId: string,
    quantityToBuy: number
  ): Observable<any> {
    return this.http
      .put(
        `${this.baseUrl}/cart_item_quantity/${cartItemId}`,
        { quantityToBuy },
        { headers: this.getHeaders() }
      )
      .pipe(tap(() => this.notifyCartUpdate()));
  }

  removeFromCart(cartItemId: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/remove_cart_item/${cartItemId}`, {
        headers: this.getHeaders(),
      })
      .pipe(tap(() => this.notifyCartUpdate()));
  }

  getCartItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_cart_items`, {
      headers: this.getHeaders(),
    });
  }

  private notifyCartUpdate(): void {
    this.cartUpdatedSubject.next(true);
  }
}
