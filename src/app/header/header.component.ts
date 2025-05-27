import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../servicios/auth-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../servicios/carrito.service';
import { ConfigService, HeaderConfig } from '../servicios/config.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  menuOpen = false;
  usuarioAutenticado = false;
  rolUsuario: number | null = null;
  rutaActual = '';
  configOpen = false;

  backgroundColor = '';
  headerColor = '';
  buttonColor = '';
  hoverColor = '';

  constructor(
    public router: Router,
    private authService: AuthService,
    public carritoService: CarritoService,
    private configService: ConfigService
  ) {
    this.authService.usuario$.subscribe(user => {
      this.usuarioAutenticado = !!user;
      this.rolUsuario = user?.rol ?? null;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.rutaActual = event.urlAfterRedirects;
      }
    });

    this.configService.getHeaderConfig().subscribe(cfg => {
      this.backgroundColor = cfg.backgroundColor;
      this.headerColor = cfg.headerColor;
      this.buttonColor = cfg.buttonColor;
      this.hoverColor = cfg.hoverColor;
      this.applySettings(false);
    });
  }

  abrirConfig() {
    this.configOpen = true;
    this.menuOpen = false;
  }

  cerrarConfig() {
    this.configOpen = false;
  }

  applySettings(save: boolean = true) {
    document.documentElement.style.setProperty('--app-bg-color', this.backgroundColor);
    document.documentElement.style.setProperty('--header-bg-color', this.headerColor);
    document.documentElement.style.setProperty('--app-button-color', this.buttonColor);
    document.documentElement.style.setProperty('--app-hover-color', this.hoverColor);
    document.body.style.backgroundColor = this.backgroundColor;

    if (save && this.rolUsuario === 1) {
      const cfg: HeaderConfig = {
        backgroundColor: this.backgroundColor,
        headerColor: this.headerColor,
        buttonColor: this.buttonColor,
        hoverColor: this.hoverColor
      };
      this.configService.updateHeaderConfig(cfg).subscribe();
    }
    this.configOpen = false;
  }

  resetDefaults() {
    this.backgroundColor = '#ffffff';
    this.headerColor     = 'rgba(255,255,255,0.9)';
    this.buttonColor     = '#28a745';
    this.hoverColor      = '#218838';
    this.applySettings();
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}