import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://bookstore-proxy-pearl.vercel.app/api';

  constructor(private http: HttpClient) {}

  signup(payload: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/bookstore_user/registration`, payload)
      .pipe(
        tap((response) => {
          const typedResponse = response as { success?: boolean; result?: any };
          if (typedResponse && typedResponse.success) {
            this.setUserName(payload.fullName);
          }
        })
      );
  }

  login(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookstore_user/login`, payload).pipe(
      tap((response) => {
        const typedResponse = response as {
          result?: {
            accessToken: string;
          };
          success?: boolean;
        };

        if (
          typedResponse &&
          typedResponse.result &&
          typedResponse.result.accessToken
        ) {
          this.setToken(typedResponse.result.accessToken);
        }
      })
    );
  }

  authToken(token: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/bookstore_user/verification/${token}`,
      { token }
    );
  }

  getUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http
      .get(`${this.baseUrl}/bookstore_user/get_user_details`, { headers })
      .pipe(
        tap((response) => {
          const typedResponse = response as {
            success?: boolean;
            result?: {
              fullName?: string;
              user?: { fullName?: string };
            };
          };

          if (typedResponse && typedResponse.success && typedResponse.result) {
            const fullName =
              typedResponse.result.fullName ||
              typedResponse.result.user?.fullName;

            if (fullName) {
              this.setUserName(fullName);
            }
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

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  setUserName(fullName: string): void {
    localStorage.setItem('userName', fullName);
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  removeUserName(): void {
    localStorage.removeItem('userName');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    this.removeToken();
    this.removeUserName();
  }
}
