import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductosComponent } from './productos/productos.component';
import { SupermercadosComponent } from './supermercados/supermercados.component';
import { RegisterComponent } from './register/register.component';
import { PrincipalComponent } from './principal/principal.component';


export const routes: Routes = [
  { path: 'principal', component: PrincipalComponent },
  { path: 'home', component: HomeComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'supermercados', component: SupermercadosComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
];