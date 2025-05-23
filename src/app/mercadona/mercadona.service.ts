import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MercadonaService {
  private apiUrl = 'http://127.0.0.1:8000/api/products/filter/supermarket/Mercadona';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
