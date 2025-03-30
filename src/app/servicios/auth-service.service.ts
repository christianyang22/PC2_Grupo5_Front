import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.rutaApi;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  login(usuario: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { usuario, password }).pipe(
      tap(response => {
        if (response && response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('nombre', response.user.nombre);
          this.loggedIn.next(true);
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
      usuario, 
      email, 
      password, 
      rol, 
      nombre, 
      apellido,
      fecha_nacimiento
    }).pipe(
      tap(response => {
        this.router.navigate(['/login']);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('nombre');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUser(): Observable<any> {
    const user = localStorage.getItem('user');
    return new Observable(observer => {
      observer.next(user ? JSON.parse(user) : null);
      observer.complete();
    });
  }

  getRolUsuario(): Observable<string> {
    return this.http.get<{ role: string }>(`${this.apiUrl}/user-role`).pipe(
      map(response => response.role)
    );
  }
}