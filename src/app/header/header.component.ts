import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../servicios/auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  usuarioAutenticado: boolean = false;
  rolUsuario: number | null = null;
  rutaActual: string = '';

  constructor(
    public router: Router,
    private authService: AuthService
  ) {
    //  Escuchar cambios de usuario (login/logout)
    this.authService.usuario$.subscribe(user => {
      if (user) {
        this.rolUsuario = user.rol;
        this.usuarioAutenticado = true;
      } else {
        this.rolUsuario = null;
        this.usuarioAutenticado = false;
      }
    });

    // Detectar la ruta actual correctamente
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.rutaActual = event.urlAfterRedirects;
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}

