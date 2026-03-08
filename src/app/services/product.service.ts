import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct, ICreateProduct } from '../products/products.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3001/products';
  private http = inject(HttpClient);

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: ICreateProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: number, data: Partial<IProduct>): Observable<IProduct> {
    return this.http.patch<IProduct>(`${this.apiUrl}/${id}`, data);
  }
}
