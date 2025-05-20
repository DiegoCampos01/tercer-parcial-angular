import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'lista', loadComponent: () => import('../../components/cursos/lista-cursos/lista-cursos.component').then(m => m.ListaCursosComponent) },
      { path: 'nuevo', loadComponent: () => import('../../components/cursos/abm-cursos/abm-cursos.component').then(m => m.AbmCursosComponent) },
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
export class CursosModule { } 