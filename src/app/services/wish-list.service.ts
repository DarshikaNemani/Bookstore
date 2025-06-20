import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private baseUrl =
    'https://bookstore.incubation.bridgelabz.com/bookstore_app/swagger/api/#/bookstore_user';

  constructor(private http: HttpClient) {}

  addWishList(product_id: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/add_wish_list/${product_id}`,
      product_id
    );
  }

  removeWishList(product_id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove_wish_list/${product_id}`);
  }

  loadWishList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_wish_list`);
  }
}
