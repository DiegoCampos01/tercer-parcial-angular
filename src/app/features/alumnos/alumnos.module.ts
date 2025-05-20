import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'lista', loadComponent: () => import('../../components/alumnos/lista-alumnos/lista-alumnos.component').then(m => m.ListaAlumnosComponent) },
      { path: 'abm', loadComponent: () => import('../../components/alumnos/abm-alumnos/abm-alumnos.component').then(m => m.AbmAlumnosComponent) },
      { path: '', redirectTo: 'lista', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AlumnosModule { } 