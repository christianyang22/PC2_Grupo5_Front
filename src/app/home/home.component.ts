import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HomeService } from './home.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  productosCarrusel: any[] = [];

  constructor(private productosService: HomeService) {}

  ngOnInit(): void {
    this.cargarProductosParaCarrusel();
  }

  cargarProductosParaCarrusel() {
    this.productosService.obtenerProductos(1).subscribe({
      next: (data: any) => {
        console.log("Productos del carrusel:", data);

        if (data && data.data && Array.isArray(data.data)) {
          const mezclados = data.data.sort(() => Math.random() - 0.5);
          this.productosCarrusel = mezclados.slice(0, 10);
        } else {
          console.warn('No se han encontrado productos válidos.');
          this.productosCarrusel = []; 
        }
      },
      error: (err) => {
        console.error('❌ Error al cargar productos del carrusel:', err);
        this.productosCarrusel = []; 
      }
    });
  }
}
