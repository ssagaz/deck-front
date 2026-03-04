import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { IProduct, ICreateProduct } from './products.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Pratos</h2>
      
      <form (ngSubmit)="createProduct()" class="mb-6 space-y-3">
        <input
          [(ngModel)]="newProduct.name"
          name="name"
          placeholder="Nome"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          [(ngModel)]="newProduct.description"
          name="description"
          placeholder="Descreva seu prato..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          [(ngModel)]="newProduct.value"
          name="value"
          type="number"
          placeholder="Price"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Criar Prato
        </button>
      </form>

      <div class="space-y-3">
        @for (product of products; track product.id) {
          <div class="border border-gray-200 p-3 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-gray-900">{{ product.name }}</h3>
                <p class="text-gray-600 text-sm">{{ product.description }}</p>
                <p class="text-green-600 font-bold">{{ product.value | currency : 'R$' }}</p>
              </div>
              <button (click)="deleteProduct(product.id)" class="text-red-600 hover:text-red-800">
                Delete
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  
  products: IProduct[] = [];
  newProduct: ICreateProduct = { name: '', description: '', value: 0 };

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products', err)
    });
  }

  createProduct() {
    if (!this.newProduct.name || !this.newProduct.value) return;
    
    this.productService.createProduct(this.newProduct).subscribe({
      next: (product) => {
        this.products.push(product);
        this.newProduct = { name: '', description: '', value: 0 };
      },
      error: (err) => console.error('Error creating product', err)
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
      },
      error: (err) => console.error('Error deleting product', err)
    });
  }

}
