import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = {
    usuario: '',
    password: ''
  };

  errorMessages: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
  
    if (token) {
      const rol = this.authService.getRole();
  
      if (rol === 1) {
        this.router.navigate(['/admin-panel']);
      } else if (rol === 2) {
        this.router.navigate(['/productos']);
      }
    }
  }
  

  onLogin(): void {
    this.authService.login(this.loginData.usuario, this.loginData.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);

        const rol = response.user.rol;

        // Guardamos el rol en el AuthService
        this.authService.setRole(rol);

        // Redirigimos según el rol
        if (rol === 1) {
          this.router.navigate(['/admin-panel']);
        } else if (rol === 2) {
          this.router.navigate(['/productos']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessages = ['Credenciales incorrectas o usuario no válido.'];
      }
    });
  }
}
