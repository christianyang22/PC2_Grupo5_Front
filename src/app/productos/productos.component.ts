import { Component, OnInit } from '@angular/core';
import { ProductosService } from './productos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth-service.service';
import { HeaderComponent } from '../header/header.component';

interface Producto {
  id: number;
  nombre: string;
  link_imagen: string;
  supermercado: string;
  precio: DoubleRange;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderComponent],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent implements OnInit {
  
  productos: any[] = [];
  productosFiltrados: any[] = [];
  terminoBusqueda: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPorPagina: number = 30;
  usuarioAutenticado: boolean = false;
  rolUsuario: number | null = null;

  // Propiedades de filtro
  precioMin: number = 0;
  precioMax: number = 1000;
  grasaMin: number = 0;
  grasaMax: number = 100;
  hidratosMin: number = 0;
  hidratosMax: number = 100;
  azucarMax: number = 100;

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.verificarSesion();
  }

  verificarSesion() {
    const token = this.authService.getToken();
    this.usuarioAutenticado = !!token;
  
    const user = this.authService.getUser();
  
    user.subscribe(data => {
      if (data) {
        this.rolUsuario = data.rol;
      }
      this.cargarProductos();
    });
  }

  // Método para cerrar sesión
  cerrarSesion() {
    this.authService.logout();
    this.usuarioAutenticado = false;
    this.rolUsuario = null;
  }

  cargarProductos() {
    this.productos = []; 
    this.productosFiltrados = [];
    this.currentPage = 1;
    this.cargarPagina(1);
  }

  cargarPagina(pagina: number) {
    this.productosService.obtenerProductos(pagina).subscribe({
      next: (data: any) => {
        console.log(`Cargando página ${pagina}:`, data);
        this.productos = [...this.productos, ...data.data];
        // Si es la primera carga, sincronizamos los productos filtrados
        if (this.productosFiltrados.length === 0) {
          this.productosFiltrados = [...this.productos];
        }
        if (pagina < data.last_page) {
          this.cargarPagina(pagina + 1);
        } else {
          console.log("Todos los productos cargados.");
          this.actualizarPaginacion();
        }
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }

  // Método de búsqueda
  buscar(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    const termino = this.terminoBusqueda.trim().toLowerCase();
    console.log("🔍 Buscando:", termino);

    // Si hay un término de búsqueda, filtramos los productos
    if (termino) {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(termino) ||
        producto.supermercado.toLowerCase().includes(termino)
      );
    } else {
      // Si no hay término de búsqueda, mostramos todos los productos
      this.productosFiltrados = [...this.productos];
    }

    console.log("Resultados encontrados:", this.productosFiltrados.length);

    // Reiniciamos la paginación al realizar una nueva búsqueda
    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    this.totalPages = Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);
  }

  obtenerProductosPaginaActual() {
    const inicio = (this.currentPage - 1) * this.itemsPorPagina;
    return this.productosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  siguientePagina() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  anteriorPagina() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Método de filtrado
  filtrarProductos() {
    this.productosFiltrados = this.productos.filter(producto => 
      producto.precio >= this.precioMin &&
      producto.precio <= this.precioMax &&
      producto.grasas >= this.grasaMin &&
      producto.grasas <= this.grasaMax &&
      producto.hidratos_carbono >= this.hidratosMin &&
      producto.hidratos_carbono <= this.hidratosMax &&
      producto.azúcar <= this.azucarMax
    );
    this.actualizarPaginacion();
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.precioMin = 0;
    this.precioMax = 1000;
    this.grasaMin = 0;
    this.grasaMax = 100;
    this.hidratosMin = 0;
    this.hidratosMax = 100;
    this.azucarMax = 100;
    this.productosFiltrados = [...this.productos];
    this.actualizarPaginacion();
  }

  ImagenSupermercado(supermercado: string): string {
    switch (supermercado) {
      case 'DIA':
        return 'img/dia.png';
      case 'MERCADONA':
        return 'img/mercadona.png';
      case 'Carrefour':
        return 'img/Carrefour.png';
      case 'ALCAMPO':
        return 'img/alcampo.png';
      case 'AMAZON':
        return 'img/amazon-fresh.png';
      default:
        return '';
    }
  }
}
