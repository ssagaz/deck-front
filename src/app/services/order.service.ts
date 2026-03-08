import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICreateOrder, IOrder, OrderStatus } from '../orders/order.interface';
import { IProduct } from '../products/products.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersUrl = 'http://localhost:3001/orders';
  private productsUrl = 'http://localhost:3001/products';
  private http = inject(HttpClient);

  createOrder(order: ICreateOrder): Observable<IOrder> {
    return this.http.post<IOrder>(this.ordersUrl, order);
  }

  getOrders(): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(this.ordersUrl);
  }

  updateOrderStatus(orderId: number, status: OrderStatus): Observable<IOrder> {
    return this.http.patch<IOrder>(`${this.ordersUrl}/${orderId}`, { status });
  }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.productsUrl);
  }
}
