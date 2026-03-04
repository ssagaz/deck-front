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
  createdAt: string;
  updatedAt: string;
}

