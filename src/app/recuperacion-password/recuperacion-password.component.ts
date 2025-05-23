import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import {
  PasswordService,
  CambiarContraseñaSinLoginPayload,
} from './password.service';
import { finalize } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperacion-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recuperacion-password.component.html',
  styleUrls: ['./recuperacion-password.component.scss'],
})
export class RecuperacionPasswordComponent {
  form: FormGroup;
  loading = false;
  success?: string;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        usuario: ['', Validators.required],
        current_password: ['', Validators.required],
        new_password: ['', [Validators.required, Validators.minLength(6)]],
        new_password_confirmation: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(control: AbstractControl) {
    const newPass = control.get('new_password')?.value;
    const confirm = control.get('new_password_confirmation')?.value;
    return newPass === confirm ? null : { passwordMismatch: true };
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = this.success = undefined;

    const payload: CambiarContraseñaSinLoginPayload = this.form.value;

    this.passwordService
      .cambiarContraseñaSinLogin(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.success = 'Contraseña actualizada correctamente. Redirigiendo…';
          // Espera breve para que el usuario vea el mensaje y luego navega
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Error al cambiar la contraseña';
        },
      });
  }

  get f() {
    return this.form.controls;
  }
}
