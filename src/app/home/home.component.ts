import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HomeService } from './home.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit, OnDestroy {
  todosLosProductos: any[] = [];
  productosCarrusel: any[] = [];
  animando: boolean = false;
  private intervalSub?: Subscription;

  constructor(private productosService: HomeService) {}

  ngOnInit(): void {
    this.cargarProductosParaCarrusel();
  }

  ngOnDestroy(): void {
    this.intervalSub?.unsubscribe();
  }

  cargarProductosParaCarrusel() {
    this.productosService.obtenerProductos(1).subscribe({
      next: (data: any) => {
        if (data && data.data && Array.isArray(data.data)) {
          this.todosLosProductos = data.data;
          this.actualizarCarrusel();

          this.intervalSub = interval(5000).subscribe(() => {
            this.iniciarAnimacion();
          });
        } else {
          this.productosCarrusel = [];
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.productosCarrusel = [];
      }
    });
  }

  iniciarAnimacion() {
    this.animando = true;

    setTimeout(() => {
      this.actualizarCarrusel();
      this.animando = false;
    }, 600);
  }

  actualizarCarrusel() {
    const copia = [...this.todosLosProductos];
    const mezclados = copia.sort(() => Math.random() - 0.5);
    const cantidad = 4;
    this.productosCarrusel = mezclados.slice(0, cantidad);
  }

  ImagenSupermercado(supermercado: string): string {

    switch (supermercado) {

      case 'DIA':
        return 'img/dia.png';

      case 'MERCADONA':
        return 'img/mercadona.png';

      case 'CARREFOUR':
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
