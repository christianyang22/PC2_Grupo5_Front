import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritosService } from './favoritos.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class FavoritosComponent implements OnInit {
  favoritos: any[] = [];
  favoritosFiltrados: any[] = [];
  terminoBusqueda: string = '';
  cargado: boolean = false;

  currentPage: number = 1;
  totalPages: number = 1;
  itemsPorPagina: number = 30;

  constructor(private favoritosService: FavoritosService) {}

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.favoritosService.obtenerFavoritosUsuario().subscribe({
      next: (res: any[]) => {
        this.favoritos = res;
        this.favoritosFiltrados = [...this.favoritos];
        this.actualizarPaginacion();
        this.cargado = true;
      },
      error: (err) => {
        console.error('Error al obtener favoritos:', err);
        this.cargado = true;
      }
    });
  }

  aplicarBusqueda(): void {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    this.favoritosFiltrados = this.favoritos.filter(fav => {
      const producto = fav.product || {};
      const nombre = producto.nombre?.toLowerCase() || '';
      const supermercado = producto.supermercado?.toLowerCase() || '';
      return nombre.includes(termino) || supermercado.includes(termino);
    });
    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  eliminarFavorito(favorito: any): void {
    this.favoritosService.eliminarFavorito(favorito.id_favorito).subscribe({
      next: () => {
        this.favoritos = this.favoritos.filter(f => f.id_favorito !== favorito.id_favorito);
        this.aplicarBusqueda();
      },
      error: (err) => console.error('Error al eliminar favorito', err)
    });
  }

  ImagenSupermercado(supermercado: string): string {
    switch (supermercado?.toUpperCase()) {
      case 'DIA': return 'img/dia.png';
      case 'MERCADONA': return 'img/mercadona.png';
      case 'CARREFOUR': return 'img/Carrefour.png';
      case 'ALCAMPO': return 'img/alcampo.png';
      case 'AMAZON': return 'img/amazon-fresh.png';
      default: return 'assets/placeholder-logo.png';
    }
  }

  actualizarPaginacion(): void {
    this.totalPages = Math.ceil(this.favoritosFiltrados.length / this.itemsPorPagina);
  }

  obtenerFavoritosPaginaActual(): any[] {
    const inicio = (this.currentPage - 1) * this.itemsPorPagina;
    return this.favoritosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
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

  esFavorito(idProducto: number): boolean {
    return this.favoritos.some(f => f.id_producto === idProducto);
  }

  toggleFavorito(producto: any): void {
    if (!producto?.id_producto) { return; }

    const favExistente = this.favoritos.find(f => f.id_producto === producto.id_producto);

    if (favExistente) {
      this.favoritos = this.favoritos.filter(f => f.id_producto !== producto.id_producto);

      this.favoritosService.eliminarFavorito(favExistente.id_favorito).subscribe({
        next: () => console.log('✅ eliminado'),
        error: err => {
          console.error('❌ error al eliminar', err);
          this.favoritos.push(favExistente);
        }
      });
    } else {
      const temp = { id_producto: producto.id_producto, id_favorito: Date.now() };
      this.favoritos.push(temp);

      this.favoritosService.agregarFavorito({ id_producto: producto.id_producto }).subscribe({
        next: res => {
          const idx = this.favoritos.findIndex(f => f.id_favorito === temp.id_favorito);
          if (idx !== -1 && res?.favourite?.id_favorito) {
            this.favoritos[idx].id_favorito = res.favourite.id_favorito;
          }
        },
        error: err => {
          console.error('❌ error al agregar', err);
          this.favoritos = this.favoritos.filter(f => f.id_favorito !== temp.id_favorito);
        }
      });
    }
  }
}