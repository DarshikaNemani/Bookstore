import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FeebackService {
  private baseUrl = 'https://bookstore-proxy-pearl.vercel.app/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'x-access-token': `${token}`,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    });
  }

  addFeedback(product_id: string, payload: { comment: string; rating: number; }): Observable<any> {
    const apiPayload = {
      comment: payload.comment,
      rating: payload.rating.toString()
    };
    return this.http.post(`${this.baseUrl}/bookstore_user/add/feedback/${product_id}`, apiPayload, { headers: this.getHeaders() });
  }

  loadFeedback(product_id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/bookstore_user/get/feedback/${product_id}`, { headers: this.getHeaders() });
  }
}