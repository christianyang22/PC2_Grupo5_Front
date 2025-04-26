import { Component, OnInit } from '@angular/core';
import { ProductosService } from './productos.service';
import { AuthService } from '../servicios/auth-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, finalize } from 'rxjs/operators';

interface Producto {
  id: number;
  nombre: string;
  link_imagen: string;
  supermercado: string;
  precio: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  terminoBusqueda: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  itemsPorPagina: number = 30;
  isLoading: boolean = false;
  usuarioAutenticado: boolean = false;
  rolUsuario: number | null = null;

  constructor(
    private productosService: ProductosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTodosLosProductos();
  }
  
  cargarTodosLosProductos(): void {
    this.isLoading = true;

    this.productosService.obtenerProductos(1).pipe(
      switchMap(resp => {
        const totalPaginas = resp.last_page;
        const llamadas = [ of(resp) ]; 


        for (let pagina = 2; pagina <= totalPaginas; pagina++) {
          llamadas.push(
            this.productosService.obtenerProductos(pagina)
              .pipe(catchError(error => {
                console.error(`Error cargando la página ${pagina}:`, error);
                return of({ data: [] });
              }))
          );
        }
        return forkJoin(llamadas);
      }),
      map((respuestas: any[]) => {
        return respuestas.reduce((acumulado, resp) => acumulado.concat(resp.data), [] as Producto[]);
      }),
      finalize(() => {
        this.isLoading = false;
        this.aplicarFiltroBusqueda();
      })
    ).subscribe({
      next: (allProducts: Producto[]) => {
        this.productos = allProducts;
      },
      error: err => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.aplicarFiltroBusqueda();
  }
  

  aplicarFiltroBusqueda(): void {
    const term = this.terminoBusqueda.trim().toLowerCase();
    let filtrados: Producto[];

    if (term === '') {
      filtrados = [...this.productos];
    } else {
      const regex = new RegExp(`\\b${term}\\b`, 'i');
      filtrados = this.productos.filter(p =>
        regex.test(p.nombre) || regex.test(p.supermercado)
      );
    }

    const uniqueMap = new Map<string, Producto>();
    filtrados.forEach(prod => {
      const nombre = prod.nombre.toLowerCase();
      if (!uniqueMap.has(nombre)) {
        uniqueMap.set(nombre, prod);
      }
    });

    this.productosFiltrados = Array.from(uniqueMap.values());

    this.currentPage = 1;
    this.totalPages = Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);
  }

  
  buscar(event?: Event): void {
    event?.preventDefault();
    this.aplicarFiltroBusqueda();
  }

  
  obtenerProductosPaginaActual(): Producto[] {
    const inicio = (this.currentPage - 1) * this.itemsPorPagina;
    return this.productosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  
  siguientePagina(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  
  anteriorPagina(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  
  cerrarSesion(): void {
    this.authService.logout();
    this.usuarioAutenticado = false;
    this.rolUsuario = null;
  }
}
