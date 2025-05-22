import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ListaAlumnosComponent } from '../../components/alumnos/lista-alumnos/lista-alumnos.component';
import { AbmAlumnosComponent } from '../../components/alumnos/abm-alumnos/abm-alumnos.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'lista', component: ListaAlumnosComponent },
      { path: 'nuevo', component: AbmAlumnosComponent },
      { path: 'editar/:id', component: AbmAlumnosComponent },
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
  ],
  exports: [RouterModule]
})
export class AlumnosModule { } 