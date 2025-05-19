import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.rutaApi;

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userRole = new BehaviorSubject<number | null>(null);

  // Nuevo: gestión del usuario completo
  private usuarioSubject = new BehaviorSubject<any>(this.getStoredUser());
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(usuario: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { usuario, password }).pipe(
      tap(response => {
        if (response && response.token && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.userRole.next(response.user.rol);
          this.loggedIn.next(true);
          this.usuarioSubject.next(response.user); // ✅ Notificar al header del nuevo usuario
        }
      })
    );
  }

  register(
    usuario: string,
    email: string,
    password: string,
    rol: number,
    nombre: string,
    apellido: string,
    fecha_nacimiento: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      usuario, email, password, rol, nombre, apellido, fecha_nacimiento
    }).pipe(
      tap(() => this.router.navigate(['/principal']))
    );
  }

  logout(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = { Authorization: `Bearer ${token}` };

      this.http.post(`${this.apiUrl}/logout`, {}, { headers }).subscribe({
        next: () => console.log('Cierre de sesión exitoso'),
        error: (err) => console.warn('Error al cerrar sesión:', err)
      });
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.userRole.next(null);
    this.usuarioSubject.next(null); // ✅ Vaciar el usuario
    this.router.navigate(['/principal']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUser(): Observable<any> {
    const user = localStorage.getItem('user');
    return of(user ? JSON.parse(user) : null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): number | null {
    return this.userRole.value;
  }

  setRole(role: number): void {
    this.userRole.next(role);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  //  Nuevo método para inicializar el usuario desde localStorage
  private getStoredUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
