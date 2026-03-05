export interface ICreateProduct {
    name: string;
    description?: string;
    value: number;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  value: number;
  enable_display: boolean;
  createdAt: string;
  updatedAt: string;
}

