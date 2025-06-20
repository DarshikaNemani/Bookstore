import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl =
    'https://bookstore.incubation.bridgelabz.com/bookstore_app/swagger/api/#/bookstore_user';

  constructor(private http: HttpClient) {}

  addProduct(product_id: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/add_cart_item/${product_id}`,
      product_id
    );
  }

  quantityProduct(cartItem_id: string, quantityToBuy: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/cart_item_quantity/${cartItem_id}`,
      quantityToBuy
    );
  }

  removeProduct(cartItem_id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/cart_item_quantity/${cartItem_id}`
    );
  }

  loadCartProduct(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_cart_items`);
  }
}
