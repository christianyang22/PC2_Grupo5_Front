import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private baseUrl = 'http://127.0.0.1:8000/api/favourites'; // Ajusta si cambia tu backend

  constructor(private http: HttpClient) {}

  // Obtener todos los favoritos del usuario autenticado
  obtenerFavoritosUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/list`);
  }

  // Agregar un producto a favoritos (solo se necesita el id del producto)
  agregarFavorito(data: { id_producto: number }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, data);
  }

  // Eliminar un producto de favoritos
  eliminarFavorito(idFavorito: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/remove/${idFavorito}`);
  }
}