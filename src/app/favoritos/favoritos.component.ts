import { Component, OnInit } from '@angular/core';
import { FavoritosService } from './favoritos.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})
export class FavoritosComponent implements OnInit {
  favoritos: any[] = [];
  cargado = false;

  constructor(private favoritosService: FavoritosService) {}

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.favoritosService.obtenerFavoritosUsuario().subscribe({
      next: (res) => {
        this.favoritos = res;
        this.cargado = true;
      },
      error: (err) => {
        console.error('Error al cargar favoritos:', err);
        this.cargado = true;
      }
    });
  }

  eliminarFavorito(favorito: any): void {
    this.favoritosService.eliminarFavorito(favorito.id_favorito).subscribe({
      next: () => {
        this.favoritos = this.favoritos.filter(f => f.id_favorito !== favorito.id_favorito);
      },
      error: (err) => console.error('Error al eliminar favorito', err)
    });
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

  getUserId(): number {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).id : 0;
  }
}