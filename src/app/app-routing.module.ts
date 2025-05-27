import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { CarritoComponent } from './carrito/carrito.component';

const routes: Routes = [
  { path: 'productos', component: ProductosComponent },
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'carrito', component: CarritoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }