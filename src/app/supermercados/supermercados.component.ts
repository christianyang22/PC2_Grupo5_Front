import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth-service.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-supermercados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supermercados.component.html',
  styleUrls: ['./supermercados.component.scss']
})
export class SupermercadosComponent implements OnInit {

  usuarioAutenticado: boolean = false;
  rolUsuario: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.verificarSesion();
  }

  verificarSesion(): void {
    const token = this.authService.getToken();
    this.usuarioAutenticado = !!token;

    this.authService.getUser().subscribe(user => {
      if (user) {
        this.rolUsuario = user.rol;
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.usuarioAutenticado = false;
    this.rolUsuario = null;
    this.router.navigate(['/home']);
  }

}