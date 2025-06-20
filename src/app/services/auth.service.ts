import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl =
    'https://bookstore.incubation.bridgelabz.com/bookstore_app/swagger/api/#/bookstore_user';

  constructor(private http: HttpClient) {}

  signup(payload: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/registration`, payload);
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  authToken(token: string): Observable<any>{
    return this.http.post(`${this.baseUrl}/bookstore_user/verification/${token}`, token);
  }
}
