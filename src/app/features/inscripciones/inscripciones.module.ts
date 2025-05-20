import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ListaInscripcionesComponent } from '../../components/inscripciones/lista-inscripciones/lista-inscripciones.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'alumno/:id',
        component: ListaInscripcionesComponent
      },
      {
        path: '',
        component: ListaInscripcionesComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class InscripcionesModule { } 