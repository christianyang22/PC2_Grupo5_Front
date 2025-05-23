import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://127.0.0.1:8000/api/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsuarios(): Observable<any[]> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  eliminarUsuario(id: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  editarUsuarioPorId(id: number, datos: any): Observable<any> {
  const headers = this.createAuthorizationHeader();
  return this.http.put(`${this.apiUrl}/${id}`, datos, { headers });
}


  private createAuthorizationHeader(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('No token encontrado, no se puede autenticar la solicitud');
    }

    

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
  }
}