import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book, ProductsResponse } from './models'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl =
    'https://bookstore.incubation.bridgelabz.com';

  constructor(private http: HttpClient) { }

  loadProducts():Observable<ProductsResponse>{
    return this.http.get<ProductsResponse>(`${this.baseUrl}/bookstore_user/get/book`)
  }
}