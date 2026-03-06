import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { CreateOrderComponent } from './orders/create-order.component';
import { OrderBoardComponent } from './orders/order-board.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'orders/create', component: CreateOrderComponent },
  { path: 'orders/board', component: OrderBoardComponent },
];
