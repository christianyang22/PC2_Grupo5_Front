import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private productosCarrito: any[] = [];

  constructor() {
    this.cargarDesdeLocalStorage();
  }

  agregarProducto(producto: any): void {
    const index = this.productosCarrito.findIndex(p => p.id_producto === producto.id_producto);

    if (index !== -1) {
      this.productosCarrito[index].cantidad += 1;
    } else {
      const nuevoProducto = {
        ...producto,
        cantidad: 1
      };
      this.productosCarrito.push(nuevoProducto);
    }

    this.guardarEnLocalStorage();
  }

  obtenerProductos(): any[] {
  return this.productosCarrito; 
  }

  obtenerTotal(): number {
    return this.productosCarrito.reduce((total, p) =>
      total + ((p.precio || 0) * (p.cantidad || 1)), 0
    );
  }


  eliminarProducto(index: number): void {
    this.productosCarrito.splice(index, 1);
    this.guardarEnLocalStorage();
  }

  vaciarCarrito(): void {
    this.productosCarrito = [];
    this.guardarEnLocalStorage();
  }

  private guardarEnLocalStorage(): void {
    localStorage.setItem('carrito', JSON.stringify(this.productosCarrito));
  }

  private cargarDesdeLocalStorage(): void {
    const datos = localStorage.getItem('carrito');
    if (datos) {
      this.productosCarrito = JSON.parse(datos);
    }
  }
}
