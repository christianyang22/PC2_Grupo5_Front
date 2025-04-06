import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductosComponent } from './productos/productos.component';
import { SupermercadosComponent } from './supermercados/supermercados.component';
import { RegisterComponent } from './register/register.component';
import { PrincipalComponent } from './principal/principal.component';
import { AdminGuard } from './guards/admin.guard';
import { ClienteGuard } from './guards/cliente.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';



export const routes: Routes = [
  { path: 'principal', component: PrincipalComponent },
  { path: 'home', component: HomeComponent },
  { path: 'productos', component: ProductosComponent, canActivate: [ClienteGuard] },
  { path: 'supermercados', component: SupermercadosComponent },
  { path: 'register', component: RegisterComponent },
  // Ruta solo visible para admins (ejemplo)
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  
];