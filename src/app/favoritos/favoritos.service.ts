import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../servicios/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private baseUrl = 'http://127.0.0.1:8000/api/favourites';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.auth.getToken()}`
      })
    };
  }

  obtenerFavoritosUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/list`, this.headers());
  }

  agregarFavorito(data: { id_producto: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, data, this.headers());
  }

  eliminarFavorito(idFavorito: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/remove/${idFavorito}`, this.headers());
  }
}