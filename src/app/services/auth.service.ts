import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://bookstore.incubation.bridgelabz.com';

  constructor(private http: HttpClient) {}

  signup(payload: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookstore_user/registration`, payload);
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookstore_user/login`, payload).pipe(
      tap(response => {
        // Type assertion to inform TypeScript about the structure
        const typedResponse = response as { result?: { accessToken: string } };
        if (typedResponse && typedResponse.result && typedResponse.result.accessToken) {
          this.setToken(typedResponse.result.accessToken);
        }
      })
    );
  }

  authToken(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookstore_user/verification/${token}`, { token });
  }

  // Token management methods
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Logout method
  logout(): void {
    this.removeToken();
  }
}
