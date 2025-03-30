import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Producto {
  id: number;
  nombre: string;
  link_imagen: string;
  supermercado: string;
  precio: DoubleRange;
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private apiUrl = 'http://127.0.0.1:8000/api/products'; 

  constructor(private http: HttpClient) {}

  obtenerProductos(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}`);
  }
}