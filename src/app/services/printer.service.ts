import { Injectable } from '@angular/core';
import { IOrder } from '../orders/order.interface';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  private device: any;
  private characteristic: any;
  private isConnected = false;

  // Standard Bluetooth Service and Characteristic UUIDs for many thermal printers
  private readonly SERVICE_UUID = 0xff00; 
  private readonly CHARACTERISTIC_UUID = 0xff01;

  async connect(): Promise<boolean> {
    try {
      this.device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { services: [this.SERVICE_UUID] },
          { namePrefix: 'KA-1445' },
          { namePrefix: 'MTP' },
          { namePrefix: 'Printer' }
        ],
        optionalServices: [this.SERVICE_UUID]
      });

      const server = await this.device.gatt.connect();
      const service = await server.getPrimaryService(this.SERVICE_UUID);
      this.characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);

      this.isConnected = true;
      this.device.addEventListener('gattserverdisconnected', () => {
        this.isConnected = false;
        console.log('Printer disconnected');
      });

      return true;
    } catch (error) {
      console.error('Connection error:', error);
      // Fallback: try to request any device with a generic printer name if specific filter fails
      try {
        this.device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: [this.SERVICE_UUID, 0x18F0] // Standard and generic service UUIDs
        });
        const server = await this.device.gatt.connect();
        // Try multiple common service UUIDs if the first one fails
        try {
           const service = await server.getPrimaryService(this.SERVICE_UUID);
           this.characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
        } catch {
           const service = await server.getPrimaryService(0x18F0);
           this.characteristic = await service.getCharacteristic(0x2AF1);
        }
        this.isConnected = true;
        return true;
      } catch (innerError) {
        console.error('Final fallback failed:', innerError);
        return false;
      }
    }
  }

  getConnectedStatus(): boolean {
    return this.isConnected;
  }

  async printOrder(order: IOrder): Promise<void> {
    if (!this.isConnected || !this.characteristic) {
      throw new Error('Printer not connected');
    }

    const encoder = new TextEncoder();
    const data = this.formatOrder(order);
    const chunks = this.splitIntoChunks(data, 20); // Sending in small chunks for Bluetooth stability

    for (const chunk of chunks) {
      await this.characteristic.writeValue(chunk);
    }
  }

  private formatOrder(order: IOrder): Uint8Array {
    const esc = {
      init: [0x1b, 0x40],
      boldOn: [0x1b, 0x45, 0x01],
      boldOff: [0x1b, 0x45, 0x00],
      center: [0x1b, 0x61, 0x01],
      left: [0x1b, 0x61, 0x00],
      feed: [0x0a, 0x0a, 0x0a]
    };

    const encoder = new TextEncoder();
    let commands: number[] = [...esc.init];

    // Header
    commands.push(...esc.center, ...esc.boldOn);
    commands.push(...Array.from(encoder.encode('DECK ESFIHAS\n')));
    commands.push(...esc.boldOff);
    commands.push(...Array.from(encoder.encode(`Pedido: #${order.id}\n`)));
    commands.push(...Array.from(encoder.encode(`${new Date(order.createdAt).toLocaleString('pt-BR')}\n`)));
    commands.push(...Array.from(encoder.encode('--------------------------------\n')));

    // Customer
    commands.push(...esc.left, ...esc.boldOn);
    commands.push(...Array.from(encoder.encode(`Cliente: ${order.customerName}\n`)));
    commands.push(...esc.boldOff);
    commands.push(...Array.from(encoder.encode(`End: ${order.customerAddress}\n`)));
    commands.push(...Array.from(encoder.encode('--------------------------------\n')));

    // Items
    commands.push(...esc.boldOn);
    commands.push(...Array.from(encoder.encode('Qtd  Item                V.Parc\n')));
    commands.push(...esc.boldOff);
    
    order.items.forEach(item => {
      const name = (item.product?.name || 'Produto').substring(0, 18).padEnd(18, ' ');
      const qty = item.quantity.toString().padEnd(4, ' ');
      const subtotal = ((item.product?.value || 0) * item.quantity).toFixed(2);
      commands.push(...Array.from(encoder.encode(`${qty} ${name} R$${subtotal}\n`)));
    });

    commands.push(...Array.from(encoder.encode('--------------------------------\n')));

    // Total
    commands.push(...esc.center, ...esc.boldOn);
    commands.push(...Array.from(encoder.encode(`TOTAL: R$${order.totalValue.toFixed(2)}\n`)));
    commands.push(...esc.boldOff);

    // Footer
    commands.push(...Array.from(encoder.encode('\nObrigado pela preferencia!\n')));
    commands.push(...esc.feed);

    return new Uint8Array(commands);
  }

  private splitIntoChunks(data: Uint8Array, size: number): Uint8Array[] {
    const chunks: Uint8Array[] = [];
    for (let i = 0; i < data.length; i += size) {
      chunks.push(data.slice(i, i + size));
    }
    return chunks;
  }
}
