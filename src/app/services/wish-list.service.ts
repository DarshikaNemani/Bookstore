import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private baseUrl = 'https://bookstore.incubation.bridgelabz.com';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'x-access-token': `${token}`,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    });
  }

  addWishList(product_id: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/bookstore_user/add_wish_list/${product_id}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  removeWishList(product_id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/bookstore_user/remove_wishlist_item/${product_id}`,
      { headers: this.getHeaders() }
    );
  }

  loadWishList(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/bookstore_user/get_wishlist_items`,
      { headers: this.getHeaders() }
    );
  }
}