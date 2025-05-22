import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { LayoutComponent } from './core/components/layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthRoutingModule)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'alumnos',
        loadChildren: () => import('./features/alumnos/alumnos.module').then(m => m.AlumnosModule)
      },
      {
        path: 'cursos',
        loadChildren: () => import('./features/cursos/cursos.module').then(m => m.CursosModule)
      },
      {
        path: 'inscripciones',
        loadChildren: () => import('./features/inscripciones/inscripciones.module').then(m => m.InscripcionesModule)
      },
      {
        path: 'notas',
        loadChildren: () => import('./features/notas/notas.module').then(m => m.NotasModule)
      },
      {
        path: 'usuarios',
        canActivate: [AdminGuard],
        loadChildren: () => import('./features/usuarios/usuarios.module').then(m => m.UsuariosModule)
      },
      {
        path: '',
        redirectTo: 'alumnos/lista',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 