import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { AuthService } from './auth-service.service';

export interface HeaderConfig {
  backgroundColor: string;
  headerColor: string;
  buttonColor: string;
  hoverColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Base URL de la API, igual que en AuthService
  private apiUrl = `${environment.rutaApi}/config/header`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** Construye los headers con el Bearer token */
  private createAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      })
    };
  }

  /** GET /config/header */
  getHeaderConfig(): Observable<HeaderConfig> {
    return this.http.get<HeaderConfig>(
      this.apiUrl,
      this.createAuthHeaders()
    );
  }

  /** PUT /config/header */
  updateHeaderConfig(config: HeaderConfig): Observable<HeaderConfig> {
    return this.http.put<HeaderConfig>(
      this.apiUrl,
      config,
      this.createAuthHeaders()
    );
  }
}