import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AmazonService {
  private apiUrl = 'http://127.0.0.1:8000/api/products/filter/supermarket/AMAZON';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
