import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { IProduct } from '../products/products.interface';
import { ICreateOrder } from '../orders/order.interface';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  template: `
    <div class="h-[calc(100vh-4rem)] flex flex-col">
      <div class="flex-1 flex flex-col p-4 pb-0 min-h-0">
        <h2 class="text-xl font-bold mb-4">Novo Pedido</h2>
        
        @if (alertMessage) {
          <div 
            [class]="alertType === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'"
            class="fixed top-4 left-4 right-4 z-[60] px-7 py-6 rounded shadow-lg max-w-md mx-auto transition-all animate-bounce-in"
          >
            {{ alertMessage }}
          </div>
        }

        <form (ngSubmit)="submitOrder()" class="flex flex-col flex-1 min-h-0">
          <div class="space-y-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
              <input
                [(ngModel)]="order.customerName"
                name="customerName"
                placeholder="Seu nome"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                [(ngModel)]="order.customerPhone"
                name="customerPhone"
                placeholder="(11) 99999-9999"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <textarea
                [(ngModel)]="order.customerAddress"
                name="customerAddress"
                placeholder="Rua, número, complemento..."
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
          </div>

          <div class="flex-1 flex flex-col min-h-0">
            <label class="block text-sm font-medium text-gray-700 mb-2">Produtos</label>
            <div class="products flex-1 overflow-y-auto space-y-2 pr-1 mb-3">
              @for (product of products; track product.id) {
                <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span class="font-medium text-gray-900">{{ product.name }}</span>
                    <span class="text-green-600 ml-2">{{ product.value | currency : 'R$' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="decrementQuantity(product.id)"
                      class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span class="w-8 text-center">{{ getQuantity(product.id) }}</span>
                    <button
                      type="button"
                      (click)="incrementQuantity(product.id)"
                      class="w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </form>
      </div>

      <div class="bg-white p-4 border-t border-gray-200">
        <div class="flex justify-between items-center text-lg font-bold mb-3">
          <span>Total:</span>
          <span class="text-green-600">{{ totalValue | currency : 'R$' }}</span>
        </div>
        <button
          (click)="submitOrder()"
          [disabled]="!isValidOrder()"
          class="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  `
})
export class CreateOrderComponent implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
 
  products: IProduct[] = [];
 
  order: ICreateOrder = {
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    items: []
  };
 
  quantities: { [key: number]: number } = {};
  
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.orderService.getProducts().subscribe({
      next: (data) => {
        this.products = data.filter(p => p.enable_display);
        this.products.forEach(p => this.quantities[p.id] = 0);
      },
      error: (err) => this.showAlert('Erro ao carregar produtos', 'error')
    });
  }

  getQuantity(productId: number): number {
    return this.quantities[productId] || 0;
  }

  incrementQuantity(productId: number) {
    this.quantities[productId] = (this.quantities[productId] || 0) + 1;
  }

  decrementQuantity(productId: number) {
    if (this.quantities[productId] > 0) {
      this.quantities[productId]--;
    }
  }

  get totalValue(): number {
    return this.products.reduce((sum, product) => {
      const qty = this.quantities[product.id] || 0;
      return sum + (product.value * qty);
    }, 0);
  }

  isValidOrder(): boolean {
    return !!(
      this.order.customerName &&
      this.order.customerPhone &&
      this.order.customerAddress &&
      this.totalValue > 0
    );
  }

  submitOrder() {
    if (!this.isValidOrder()) return;

    const items = Object.entries(this.quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({
        productId: parseInt(productId),
        quantity
      }));

    this.order.items = items;

    this.orderService.createOrder(this.order).subscribe({
      next: () => {
        this.showAlert('Pedido adicionado a fila com sucesso!', 'success');
        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 2000);
      },
      error: (err) => {
        this.showAlert('Erro ao criar pedido. Tente novamente.', 'error');
      }
    });
  }

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
    }, 5000);
  }
}
