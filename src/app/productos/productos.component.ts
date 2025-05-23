import { Component, OnInit } from '@angular/core';
import { ProductosService } from './productos.service';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FavoritosService } from '../favoritos/favoritos.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSliderModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  favoritos: any[] = [];
  terminoBusqueda: string = '';

  currentPage: number = 1;
  totalPages: number = 1;
  itemsPorPagina: number = 30;

  usuarioAutenticado: boolean = false;
  rolUsuario: number | null = null;
  idUsuario: number | null = null;

  // Filtros
  precioMin = 0;
  precioMax = 1000;
  grasaMin = 0;
  grasaMax = 1000;
  hidratosMin = 0;
  hidratosMax = 1000;
  azucarMin = 0;
  azucarMax = 1000;

  // Opciones sliders
  optionsPrecio: Options = {
    floor: 0,
    ceil: 1000,
    showTicks: false,
    showTicksValues: false
  };

  optionsGrasa: Options = {
    floor: 0,
    ceil: 1000,
    showTicks: false,
    showTicksValues: false
  };

  optionsHidratos: Options = {
    floor: 0,
    ceil: 1000,
    showTicks: false,
    showTicksValues: false
  };

  optionsAzucar: Options = {
    floor: 0,
    ceil: 1000,
    showTicks: false,
    showTicksValues: false
  };

  constructor(
    private productosService: ProductosService,
    private router: Router,
    private authService: AuthService,
    private favoritosService: FavoritosService
  ) {}

  ngOnInit(): void {
    this.verificarSesion();
  }

  verificarSesion(): void {
    const token = this.authService.getToken();
    this.usuarioAutenticado = !!token;

    const user = this.authService.getUser();
    user.subscribe(data => {
      if (data) {
        this.rolUsuario = data.rol;
        this.idUsuario = data.id;
        this.cargarFavoritos();
      }
      this.cargarProductos();
    });
  }


  cerrarSesion(): void {
    this.authService.logout();
    this.usuarioAutenticado = false;
    this.rolUsuario = null;
    this.router.navigate(['/principal']);
  }

  cargarProductos(): void {
    this.productos = [];
    this.productosFiltrados = [];
    this.currentPage = 1;
    this.cargarPagina(1);
  }

  cargarPagina(pagina: number): void {
    this.productosService.obtenerProductos(pagina).subscribe({
      next: (data: any) => {
        this.productos = [...this.productos, ...data.data];
        if (this.productosFiltrados.length === 0) {
          this.productosFiltrados = [...this.productos];
        }
        if (pagina < data.last_page) {
          this.cargarPagina(pagina + 1);
        } else {
          this.actualizarPaginacion();
        }
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }

  aplicarFiltrosYBusqueda(): void {
    const termino = this.terminoBusqueda.trim().toLowerCase();

    this.productosFiltrados = this.productos.filter(producto => {
      const nombre = producto.nombre?.toLowerCase() || '';
      const supermercado = producto.supermercado?.toLowerCase() || '';

      const coincideBusqueda =
        nombre.includes(termino) || supermercado.includes(termino);

      const coincideFiltros =
        producto.precio >= this.precioMin &&
        producto.precio <= this.precioMax &&
        producto.grasas >= this.grasaMin &&
        producto.grasas <= this.grasaMax &&
        producto.hidratos_carbono >= this.hidratosMin &&
        producto.hidratos_carbono <= this.hidratosMax &&
        producto.azucar >= this.azucarMin &&
        producto.azucar <= this.azucarMax;

      return coincideBusqueda && coincideFiltros;
    });

    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.precioMin = 0;
    this.precioMax = 1000;
    this.grasaMin = 0;
    this.grasaMax = 1000;
    this.hidratosMin = 0;
    this.hidratosMax = 1000;
    this.azucarMin = 0;
    this.azucarMax = 1000;
    this.productosFiltrados = [...this.productos];
    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    this.totalPages = Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);
  }

  obtenerProductosPaginaActual(): any[] {
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

  ImagenSupermercado(supermercado: string): string {
    switch (supermercado.toUpperCase()) {
      case 'DIA': return 'img/dia.png';
      case 'MERCADONA': return 'img/mercadona.png';
      case 'CARREFOUR': return 'img/Carrefour.png';
      case 'ALCAMPO': return 'img/alcampo.png';
      case 'AMAZON': return 'img/amazon-fresh.png';
      default: return 'assets/placeholder-logo.png';
    }
  }

  // FAVORITOS
  cargarFavoritos(): void {
  if (!this.idUsuario) return;
    this.favoritosService.obtenerFavoritosUsuario().subscribe({
      next: (res) => {
        // Asegura estructura uniforme
        this.favoritos = res.map(f => ({
          id_favorito: f.id_favorito,
          id_producto: f.id_producto,
          id_usuario: f.id_usuario
        }));
      },
      error: (err) => {
        console.error('Error al cargar favoritos:', err);
      }
    });
  }

  esFavorito(idProducto: number): boolean {
    return this.favoritos.some(f => f.id_producto === idProducto);
  }

  toggleFavorito(producto: any): void {
    if (!producto?.id_producto) { return; }

    const favExistente = this.favoritos.find(f => f.id_producto === producto.id_producto);

    if (favExistente) {
      // Quitar visualmente
      this.favoritos = this.favoritos.filter(f => f.id_producto !== producto.id_producto);

      this.favoritosService.eliminarFavorito(favExistente.id_favorito).subscribe({
        next : () => console.log('✅ eliminado'),
        error: err => {
          console.error('❌ error al eliminar', err);
          this.favoritos.push(favExistente);            // rollback
        }
      });

    } else {
      const temp = { id_producto: producto.id_producto, id_favorito: Date.now() };
      this.favoritos.push(temp);                        // optimista

      this.favoritosService.agregarFavorito({ id_producto: producto.id_producto }).subscribe({
        next : res => {
          const idx = this.favoritos.findIndex(f => f.id_favorito === temp.id_favorito);
          if (idx !== -1 && res?.favourite?.id_favorito) {
            this.favoritos[idx].id_favorito = res.favourite.id_favorito;
          }
        },
        error: err => {
          console.error('❌ error al agregar', err);
          this.favoritos = this.favoritos.filter(f => f.id_favorito !== temp.id_favorito); // rollback
        }
      });
    }
  }
}