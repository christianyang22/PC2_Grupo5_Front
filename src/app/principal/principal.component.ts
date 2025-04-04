import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servicios/auth-service.service';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent{
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