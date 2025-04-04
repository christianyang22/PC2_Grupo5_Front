import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ProductosService } from '../productos/productos.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {

  productosCarrusel: any[] = [];

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargarProductosParaCarrusel();
  }

  cargarProductosParaCarrusel() {
    this.productosService.obtenerProductos(1).subscribe({
      next: (data: any) => {
        console.log("✅ Productos del carrusel:", data);

        if (data && data.data && Array.isArray(data.data)) {
          const mezclados = data.data.sort(() => Math.random() - 0.5);
          this.productosCarrusel = mezclados.slice(0, 10);
        } else {
          console.warn('⚠️ Datos inesperados, usando productos de prueba.');
          this.ponerProductosDePrueba();
        }
      },
      error: (err) => {
        console.error('❌ Error al cargar productos del carrusel:', err);
        this.ponerProductosDePrueba();
      }
    });
  }

  ponerProductosDePrueba() {
    this.productosCarrusel = [
      {
        nombre: 'Jamón York',
        precio: 2.50,
        link_imagen: 'assets/placeholder.jpg'
      },
      {
        nombre: 'Leche Entera',
        precio: 1.15,
        link_imagen: 'assets/placeholder.jpg'
      },
      {
        nombre: 'Huevos',
        precio: 1.75,
        link_imagen: 'assets/placeholder.jpg'
      },
      {
        nombre: 'Arroz Integral',
        precio: 1.35,
        link_imagen: 'assets/placeholder.jpg'
      },
      {
        nombre: 'Aceite de Oliva',
        precio: 3.99,
        link_imagen: 'assets/placeholder.jpg'
      }
    ];
  }
}
