import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Payload for the unauthenticated password‑change endpoint.
 */
export interface CambiarContraseñaSinLoginPayload {
  usuario: string;
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

@Injectable({
  providedIn: 'root',
})
export class PasswordService {

  private readonly apiUrl =
    'http://127.0.0.1:8000/api/user/cambiar-contraseña';

  constructor(private http: HttpClient) {}

  cambiarContraseñaSinLogin(
    payload: CambiarContraseñaSinLoginPayload
  ): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
