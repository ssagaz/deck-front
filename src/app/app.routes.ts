import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { CreateOrderComponent } from './orders/create-order.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'orders/create', component: CreateOrderComponent },
];
