import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.verificarSesion();
  }

  verificarSesion(): void {
    const token = this.authService.getToken();
    this.usuarioAutenticado = !!token;

    this.authService.getUser().subscribe({
      next: (data) => {
        if (data && typeof data.rol !== 'undefined') {
          this.rolUsuario = data.rol;
        }
      },
      error: () => {
        this.usuarioAutenticado = false;
        this.rolUsuario = null;
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.usuarioAutenticado = false;
    this.rolUsuario = null;
    this.router.navigate(['/login']);
  }
}

