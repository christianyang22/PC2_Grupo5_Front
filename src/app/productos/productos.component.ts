import { Component, OnInit } from '@angular/core';
import { ProductosService } from './productos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth-service.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, finalize } from 'rxjs/operators';


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
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})

export class ProductosComponent implements OnInit {

  productos: any[] = [];
  productosFiltrados: any[] = [];
  terminoBusqueda: string = '';
  currentPage: number = 1;
  totalPages: number = 999;
  itemsPorPagina: number = 30;
  usuarioAutenticado: boolean = false;
  isLoading = false;

  rolUsuario: number | null = null;

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.verificarSesion();
    this.cargarPagina(1);
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
  
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.productosFiltrados = [...this.productos];
    this.currentPage = 1;
    this.actualizarPaginacion();
  }

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
        this.productosFiltrados = [...this.productos];
  
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
  
  private loadAllProducts() {
    this.isLoading = true;
    return this.productosService.obtenerProductos(1).pipe(
      // 1) Obtener la primera página para saber cuántas hay
      map(resp => ({
        pages: [ resp ],
        last: resp.last_page
      })),
      // 2) En un switchMap generamos un forkJoin con todas las páginas
      switchMap(({ pages, last }) => {
        const calls = pages.map(r => of(r));  // ya tenemos resp1
        for (let p = 2; p <= last; p++) {
          calls.push(
            this.productosService.obtenerProductos(p)
              .pipe(catchError(() => of({ data: [] })))
          );
        }
        return forkJoin(calls);
      }),
      // 3) Cada elemento de la respuesta es { data: Producto[] }, lo aplanamos
      map((allResps: any[]) =>
        allResps
          .map(r => r.data as Producto[])
          .reduce((acc, arr) => acc.concat(arr), [])
      ),
      // 4) Al completar, desactivamos el spinner
      finalize(() => this.isLoading = false)
    );
  }

  buscar(event?: Event): void {
    event?.preventDefault();
    const term = this.terminoBusqueda.trim().toLowerCase();
  
    if (!term) {
      // Si borras el término, vuelves a la página actual:
      this.productosFiltrados = [...this.productos];
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);
      return;
    }
  
    // 1) Reinicia arrays y enciende spinner
    this.productos = [];
    this.productosFiltrados = [];
    this.isLoading = true;
  
    // 2) Baja TODO el catálogo de nuevo
    this.loadAllProducts().subscribe({
      next: allProducts => {
        // 3) Asigna el catálogo completo
        this.productos = allProducts;
  
        // 4) Filtra y asigna productosFiltrados
        this.productosFiltrados = allProducts.filter(p =>
          p.nombre.toLowerCase().includes(term) ||
          p.supermercado.toLowerCase().includes(term)
        );
  
        // 5) Reinicia paginación local
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);
      },
      error: err => {
        console.error('Error al recargar catálogo en búsqueda:', err);
      },
      complete: () => {
        // 6) Apaga spinner
        this.isLoading = false;
      }
    });
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
}
 