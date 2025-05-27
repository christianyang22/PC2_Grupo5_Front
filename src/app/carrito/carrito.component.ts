import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../servicios/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent {

  mensajeConfirmacion: string = '';

  constructor(public carritoService: CarritoService) {}

  eliminarDelCarrito(index: number): void {
    this.carritoService.eliminarProducto(index);
  }

  obtenerTotalCarrito(): number {
  return this.carritoService.obtenerProductos()
    .reduce((total, prod) => total + ((prod.precio || 0) * (prod.cantidad || 1)), 0);
  }

  finalizarCompra(): void {
    if (this.carritoService.obtenerProductos().length === 0) {
      this.mensajeConfirmacion = '🛑 El carrito está vacío. Añade productos antes de finalizar la compra.';
    } else {
      this.mensajeConfirmacion = '✅ ¡Gracias por tu compra! Hemos recibido tu pedido.';
      this.carritoService.vaciarCarrito(); // si tienes este método, o limpia manualmente
    }

    setTimeout(() => this.mensajeConfirmacion = '', 4000);
  }



}
