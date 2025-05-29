import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUsuariosComponent } from './lista-usuarios.component';

const routes: Routes = [
  { path: '', component: ListaUsuariosComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ListaUsuariosModule { } 