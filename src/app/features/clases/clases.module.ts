import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'lista', loadComponent: () => import('../../components/clases/lista-clases/lista-clases.component').then(m => m.ListaClasesComponent) },
      { path: 'nueva', loadComponent: () => import('../../components/clases/abm-clases/abm-clases.component').then(m => m.AbmClasesComponent) },
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
export class ClasesModule { } 