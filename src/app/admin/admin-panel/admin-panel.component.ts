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

editarUsuario(usuario: any): void {
  try {
    const nuevoUsuario = prompt('Nuevo nombre de usuario:', usuario.usuario);
    const nuevoNombre = prompt('Nuevo nombre completo:', usuario.nombre);
    const nuevoCorreo = prompt('Nuevo correo electrónico:', usuario.email);
    const rolPorDefecto = usuario.rol !== undefined && usuario.rol !== null ? usuario.rol.toString() : '2';
    const nuevoRolStr = prompt('Nuevo rol (1 = Admin, 2 = Usuario):', rolPorDefecto);
    const nuevaPassword = prompt('Nueva contraseña (opcional):');

    if (
      nuevoUsuario === null ||
      nuevoNombre === null ||
      nuevoCorreo === null ||
      nuevoRolStr === null
    ) {
      alert('Edición cancelada.');
      return;
    }

    const nuevoRol = parseInt(nuevoRolStr, 10);
    if (isNaN(nuevoRol) || (nuevoRol !== 1 && nuevoRol !== 2)) {
      alert('Rol inválido. Usa 1 para Admin o 2 para Usuario.');
      return;
    }

    const confirmacion = confirm(
      `¿Confirmas editar al usuario con estos datos?\n\n` +
      `Usuario: ${nuevoUsuario}\nNombre: ${nuevoNombre}\nEmail: ${nuevoCorreo}\nRol: ${nuevoRol === 1 ? 'Admin' : 'Usuario'}\nContraseña: ${nuevaPassword ? 'Sí' : 'No'}`
    );

    if (!confirmacion) {
      alert('Edición cancelada.');
      return;
    }

    const datosActualizados: any = {
      usuario: nuevoUsuario,
      nombre: nuevoNombre,
      email: nuevoCorreo,
      rol: nuevoRol
    };

    if (nuevaPassword && nuevaPassword.trim() !== '') {
      datosActualizados.password = nuevaPassword;
    }

    this.usuarioService.editarUsuarioPorId(usuario.id_usuario, datosActualizados).subscribe({
      next: () => {
        this.cargarUsuarios();
        alert('Usuario editado correctamente.');
      },
      error: err => {
        console.error('Error al editar usuario:', err);
        alert(
          'Hubo un error al editar el usuario.\n\n' +
          (err?.error?.message || err.message || 'Error desconocido')
        );
      }
    });
  } catch (e) {
    console.error('Error inesperado durante la edición:', e);
    alert('Ocurrió un error inesperado.');
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