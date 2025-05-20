import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AmazonService } from './amazon.service';

@Component({
  selector: 'app-amazon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './amazon.component.html',
  styleUrls: ['./amazon.component.scss']
})
export class AmazonComponent implements OnInit {
  productos: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  terminoBusqueda: string = '';

  cargando = false;
  error = '';

  constructor(private amazonService: AmazonService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.amazonService.obtenerProductos().subscribe({
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
      case 'AMAZON':
        return 'img/amazon-fresh.png';
      default:
        return '';
    }
  }
}
