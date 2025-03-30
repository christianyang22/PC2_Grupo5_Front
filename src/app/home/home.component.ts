import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servicios/auth-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginData = {
    usuario: '',
    password: ''
  };

  errorMessages: string[] = [];

  constructor(private authService: AuthService) {}

  onLogin(): void {
    this.authService.login(this.loginData.usuario, this.loginData.password).subscribe(
      response => {
        console.log('Login exitoso:', response);
        
        localStorage.setItem('usuario', JSON.stringify({ usuario: this.loginData.usuario }));

        window.location.href = '/productos';
      },
      error => {
        console.error('Error en login:', error);
        this.errorMessages = ['Credenciales incorrectas.'];
      }
    );
  }
}