import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AlumnosService } from './services/alumnos.service';
import { CursosService } from './services/cursos.service';
import { ClasesService } from './services/clases.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/auth.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AlumnosService,
    CursosService,
    ClasesService,
    AuthService,
    AuthGuard
  ],
  exports: [
    HttpClientModule
  ]
})
export class CoreModule { } 