import { IProduct } from '../products/products.interface';

export interface IOrderItem {
  productId: number;
  quantity: number;
  product?: IProduct;
}

export interface ICreateOrder {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  items: IOrderItem[];
}

export interface IOrder {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: OrderStatus;
  totalValue: number;
  items: IOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  IN_PREPARATION = 'IN_PREPARATION',
  CANCELED = 'CANCELED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  CONFIRMED = 'CONFIRMED',
  AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION',
}
