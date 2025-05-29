import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

// Services
import { AuthService } from './services/auth.service';
import { AlumnosService } from './services/alumnos.service';
import { ClasesService } from './services/clases.service';
import { CursosService } from './services/cursos.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    AlumnosService,
    ClasesService,
    CursosService,
    AuthGuard,
    AdminGuard
  ],
  exports: [
    HttpClientModule
  ]
})
export class CoreModule { } 