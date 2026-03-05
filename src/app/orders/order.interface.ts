export interface IOrderItem {
  productId: number;
  quantity: number;
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
  status: string;
  totalValue: number;
  items: IOrderItem[];
  createdAt: string;
  updatedAt: string;
}
