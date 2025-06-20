import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl =
    'https://bookstore.incubation.bridgelabz.com/bookstore_app/swagger/api/#/bookstore_user';

  constructor(private http: HttpClient) { }

  loadProducts():Observable<any>{
    return this.http.get(`${this.baseUrl}/get/book`)
  }

}
