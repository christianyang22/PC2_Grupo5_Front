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
  constructor(public carritoService: CarritoService) {}

  eliminarDelCarrito(index: number): void {
    this.carritoService.eliminarProducto(index);
  }

  obtenerTotalCarrito(): number {
  return this.carritoService.obtenerProductos()
    .reduce((total, prod) => total + ((prod.precio || 0) * (prod.cantidad || 1)), 0);
}


}
