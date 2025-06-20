import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeebackService {
  private baseUrl =
    'https://bookstore.incubation.bridgelabz.com/bookstore_app/swagger/api/#/bookstore_user';

  constructor(private http: HttpClient) {}

  addFeedback(
    product_id: string,
    payload: {
      comment: string;
      rating: number;
    }
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/add/feedback/${product_id}`, payload);
  }

  loadFeedback(product_id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get/feedback/${product_id}`);
  }
}
