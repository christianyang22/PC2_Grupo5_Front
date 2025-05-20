import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../servicios/auth-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  usuarioAutenticado = false;
  rolUsuario: number | null = null;
  rutaActual = '';
  configOpen = false;
  backgroundColor = '#ffffff';
  headerColor = '#ffffff';
  buttonColor = '#007bff';
  hoverColor = '#0056b3';

  constructor(public router: Router, private authService: AuthService) {
    this.authService.usuario$.subscribe(user => {
      this.usuarioAutenticado = !!user;
      this.rolUsuario = user?.rol ?? null;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.rutaActual = event.urlAfterRedirects;
      }
    });
    const saved = localStorage.getItem('appConfig');
    if (saved) {
      const cfg = JSON.parse(saved);
      this.backgroundColor = cfg.backgroundColor;
      this.headerColor     = cfg.headerColor;
      this.buttonColor     = cfg.buttonColor;
      this.hoverColor      = cfg.hoverColor;
      this.applySettings();
    }
  }

  abrirConfig() {
    this.configOpen = true;
  }

  cerrarConfig() {
    this.configOpen = false;
  }

  applySettings() {
    document.documentElement.style.setProperty('--app-bg-color', this.backgroundColor);
    document.documentElement.style.setProperty('--header-bg-color', this.headerColor);
    document.documentElement.style.setProperty('--app-button-color', this.buttonColor);
    document.documentElement.style.setProperty('--app-hover-color', this.hoverColor);
    localStorage.setItem('appConfig', JSON.stringify({
      backgroundColor: this.backgroundColor,
      headerColor:     this.headerColor,
      buttonColor:     this.buttonColor,
      hoverColor:      this.hoverColor
    }));
    this.configOpen = false;
  }

  resetDefaults() {
    this.backgroundColor = '#ffffff';
    this.headerColor     = '#ffffff';
    this.buttonColor     = '#007bff';
    this.hoverColor      = '#0056b3';
    this.applySettings();
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}