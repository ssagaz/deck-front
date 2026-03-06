import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { OrderService } from '../services/order.service';
import { IOrder, OrderStatus } from './order.interface';

@Component({
  selector: 'app-order-board',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="p-4 bg-gray-100 min-h-screen pb-20">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Quadro de Pedidos</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (order of orders; track order.id) {
          <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col">
            <!-- Header -->
            <div class="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div>
                <h3 class="font-bold text-lg text-gray-900">{{ order.customerName }}</h3>
                <p class="text-xs text-gray-500">Pedido #{{ order.id }} • {{ order.createdAt | date: 'HH:mm' }}</p>
              </div>
              <span [class]="getStatusClass(order.status)" class="px-2 py-1 rounded-full text-xs font-semibold">
                {{ translateStatus(order.status) }}
              </span>
            </div>

            <!-- Content -->
            <div class="p-4 flex-1">
              <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Itens do Pedido</h4>
              <ul class="space-y-2">
                @for (item of order.items; track item.productId) {
                  <li class="flex justify-between text-sm">
                    <span class="text-gray-700">
                      <span class="font-medium text-blue-600">{{ item.quantity }}x</span> {{ item.product?.name || 'Produto' }}
                    </span>
                    <span class="text-gray-500">{{ ((item.product?.value || 0) * item.quantity) | currency:'R$' }}</span>
                  </li>
                }
              </ul>
            </div>

            <!-- Footer -->
            <div class="p-4 bg-gray-50 border-t border-gray-100">
              <div class="flex items-start gap-2 mb-3">
                <svg class="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-xs text-gray-600 leading-relaxed">{{ order.customerAddress }}</p>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm font-bold text-gray-900">Total</span>
                <span class="text-lg font-bold text-green-600">{{ order.totalValue | currency:'R$' }}</span>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>Nenhum pedido encontrado no momento.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class OrderBoardComponent implements OnInit {
  orders: IOrder[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (err) => console.error('Error loading board data', err)
    });
  }

  translateStatus(status: OrderStatus): string {
    const translations: Record<OrderStatus, string> = {
      [OrderStatus.AWAITING_CONFIRMATION]: 'Aguardando Confirmação',
      [OrderStatus.CONFIRMED]: 'Confirmado',
      [OrderStatus.IN_PREPARATION]: 'Em Preparação',
      [OrderStatus.OUT_FOR_DELIVERY]: 'Saiu para Entrega',
      [OrderStatus.CANCELED]: 'Cancelado',
    };
    return translations[status] || status;
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.AWAITING_CONFIRMATION:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.IN_PREPARATION:
        return 'bg-orange-100 text-orange-800';
      case OrderStatus.OUT_FOR_DELIVERY:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.CANCELED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
