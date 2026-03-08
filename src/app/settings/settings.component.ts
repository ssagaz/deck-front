import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrinterService } from '../services/printer.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Configurações</h2>

      <div class="grid grid-cols-2 gap-4">
        <!-- Printer Card -->
        <button 
          (click)="connectPrinter()"
          class="aspect-square bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform hover:shadow-md"
        >
          <div [class]="isConnected ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'" class="p-4 rounded-full">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </div>
          <span class="font-bold text-gray-700">Impressora</span>
          <span [class]="isConnected ? 'text-green-600 font-medium' : 'text-gray-400 font-medium'" class="text-[10px] uppercase">
             {{ isConnected ? 'Conectado' : 'Desconectado' }}
          </span>
        </button>

        <!-- Placeholder for other settings -->
        <div class="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center">
          <span class="text-gray-400 text-xs italic">Mais em breve...</span>
        </div>
      </div>

      <div *ngIf="statusMessage" [class]="statusColor" class="mt-8 p-4 rounded-lg text-sm font-medium">
        {{ statusMessage }}
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  private printerService = inject(PrinterService);
  isConnected = false;
  statusMessage = '';
  statusColor = '';

  ngOnInit() {
    this.isConnected = this.printerService.getConnectedStatus();
  }

  async connectPrinter() {
    this.statusMessage = 'Conectando à impressora...';
    this.statusColor = 'bg-blue-50 text-blue-800';
    
    const success = await this.printerService.connect();
    this.isConnected = success;

    if (success) {
      this.statusMessage = 'Impressora conectada com sucesso!';
      this.statusColor = 'bg-green-50 text-green-800';
    } else {
      this.statusMessage = 'Falha ao conectar. Verifique se o Bluetooth está ligado e a impressora visível.';
      this.statusColor = 'bg-red-50 text-red-800';
    }

    setTimeout(() => {
      this.statusMessage = '';
    }, 5000);
  }
}
