import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICreateOrder, IOrder } from '../orders/order.interface';
import { IProduct } from '../products/products.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersUrl = 'http://localhost:3001/orders';
  private productsUrl = 'http://localhost:3001/products';

  constructor(private http: HttpClient) {}

  createOrder(order: ICreateOrder): Observable<IOrder> {
    return this.http.post<IOrder>(this.ordersUrl, order);
  }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.productsUrl);
  }
}
