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
    return this.http.post(`${this.baseUrl}/bookstore_user/registration`, payload).pipe(
      tap(response => {
        // Store fullName during signup if response is successful
        const typedResponse = response as { success?: boolean; result?: any };
        if (typedResponse && typedResponse.success) {
          this.setUserName(payload.fullName);
        }
      })
    );
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookstore_user/login`, payload).pipe(
      tap(response => {
        // Type assertion to inform TypeScript about the structure
        const typedResponse = response as { 
          result?: { 
            accessToken: string;
            fullName?: string;
          };
          success?: boolean;
        };
        if (typedResponse && typedResponse.result && typedResponse.result.accessToken) {
          this.setToken(typedResponse.result.accessToken);
          
          // Store fullName if available in response
          if (typedResponse.result.fullName) {
            this.setUserName(typedResponse.result.fullName);
          }
        }
      })
    );
  }

  authToken(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookstore_user/verification/${token}`, { token });
  }

  // Get user profile
  getUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/bookstore_user/get_user_details`, { headers }).pipe(
      tap(response => {
        const typedResponse = response as { success?: boolean; result?: { fullName?: string } };
        if (typedResponse && typedResponse.success && typedResponse.result?.fullName) {
          this.setUserName(typedResponse.result.fullName);
        }
      })
    );
  }

  private getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'x-access-token': token || '',
    };
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

  // Username management methods
  setUserName(fullName: string): void {
    localStorage.setItem('userName', fullName);
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  removeUserName(): void {
    localStorage.removeItem('userName');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  // Logout method
  logout(): void {
    this.removeToken();
    this.removeUserName(); // Also remove username on logout
  }
}