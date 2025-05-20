import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrefourService } from './carrefour.service';

@Component({
  selector: 'app-carrefour',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrefour.component.html',
  styleUrls: ['./carrefour.component.scss']
})
export class CarrefourComponent implements OnInit {
  productos: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  terminoBusqueda: string = '';

  cargando = false;
  error = '';

  constructor(private carrefourService: CarrefourService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.carrefourService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  obtenerProductosPaginaActual(): any[] {
    const filtrados = this.productos.filter(producto =>
      producto.nombre?.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filtrados.slice(start, end);
  }

  get totalPages(): number {
    const filtrados = this.productos.filter(producto =>
      producto.nombre?.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
    return Math.ceil(filtrados.length / this.itemsPerPage);
  }

  siguientePagina(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  anteriorPagina(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  ImagenSupermercado(supermercado: string): string {
    switch (supermercado) {
      case 'Carrefour':
        return 'img/Carrefour.png';
      default:
        return '';
    }
  }
}
