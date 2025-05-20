import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servicios/auth-service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerData = {
    usuario: '',
    email: '',
    password: '',
    rol: 2,
    nombre: '',
    apellido: '',
    fecha_nacimiento: ''
  };

  errorMessages: string[] = [];

  constructor(private authService: AuthService) {}

  onRegister(): void {
    this.authService.register(
      this.registerData.usuario,
      this.registerData.email,
      this.registerData.password,
      this.registerData.rol,
      this.registerData.nombre,
      this.registerData.apellido,
      this.registerData.fecha_nacimiento
    ).subscribe(
      response => {
        console.log('Registro exitoso', response);
        window.location.href = '/home';
      },
      error => {
        console.error('Error en registro', error);
        this.errorMessages = [];
        if (error.error && error.error.errors) {
          for (const key in error.error.errors) {
            if (error.error.errors.hasOwnProperty(key)) {
              this.errorMessages.push(...error.error.errors[key]);
            }
          }
        } else {
          this.errorMessages.push("Ocurrió un error inesperado. Intente más tarde.");
        }
      }
    );
  }
}