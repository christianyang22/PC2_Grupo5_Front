import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductosComponent } from './productos/productos.component';
import { SupermercadosComponent } from './supermercados/supermercados.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdminGuard } from './guards/admin.guard';
import { ClienteGuard } from './guards/cliente.guard';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { AlcampoComponent } from './alcampo/alcampo.component';
import { AmazonComponent } from './amazon/amazon.component';
import { CarrefourComponent } from './carrefour/carrefour.component';
import { DiaComponent } from './dia/dia.component';
import { MercadonaComponent } from './mercadona/mercadona.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'productos', component: ProductosComponent},
  { path: 'supermercados', component: SupermercadosComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'alcampo', component: AlcampoComponent },
  { path: 'amazon', component: AmazonComponent },
  { path: 'carrefour', component: CarrefourComponent },
  { path: 'dia', component: DiaComponent },
  { path: 'mercadona', component: MercadonaComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'header', component: HeaderComponent },


  // Ruta solo visible para admins (ejemplo)
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  
];