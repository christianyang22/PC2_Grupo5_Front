import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../servicios/auth-service.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { ProductoService } from '../../servicios/producto.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  usuarioAutenticado: boolean = false;
  rolUsuario: number | null = null;

  usuarios: any[] = [];
  productos: any[] = [];

  constructor(
    public authService: AuthService,
    private usuarioService: UsuarioService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    this.usuarioAutenticado = !!token;

    this.authService.getUser().subscribe(user => {
      this.rolUsuario = user?.rol ?? null;
      if (this.rolUsuario === 1) {
        this.cargarUsuarios();
        this.cargarProductos();
      }
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: usuarios => this.usuarios = usuarios ?? [],
      error: err => console.error('Error al cargar usuarios:', err)
    });
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: productos => this.productos = productos.data ?? [],
      error: err => console.error('Error al cargar productos:', err)
    });
  }

  eliminarUsuario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          this.cargarUsuarios();
          alert('Usuario eliminado correctamente.');
        },
        error: err => console.error('Error eliminando usuario:', err)
      });
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.cargarProductos();
          alert('Producto eliminado correctamente.');
        },
        error: err => console.error('Error eliminando producto:', err)
      });
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.usuarioAutenticado = false;
    this.rolUsuario = null;
    this.router.navigate(['/home']);
  }

  navegarAProductos(): void {
    this.router.navigate(['/productos']);
  }

  navegarASupermercados(): void {
    this.router.navigate(['/supermercados']);
  }

  navegarAFavoritos(): void {
    this.router.navigate(['/favoritos']);
  }

  navegarAAdmin(): void {
    this.router.navigate(['/admin-panel']);
  }

  navegarALogin(): void {
    this.router.navigate(['/login']);
  }
}