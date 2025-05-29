import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { LayoutComponent } from './core/components/layout/layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'alumnos',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/alumnos/lista-alumnos/lista-alumnos.component').then(m => m.ListaAlumnosComponent)
          },
          {
            path: 'nuevo',
            loadComponent: () => import('./components/alumnos/abm-alumnos/abm-alumnos.component').then(m => m.AbmAlumnosComponent)
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./components/alumnos/abm-alumnos/abm-alumnos.component').then(m => m.AbmAlumnosComponent)
          }
        ]
      },
      {
        path: 'cursos',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/cursos/lista-cursos/lista-cursos.component').then(m => m.ListaCursosComponent)
          },
          {
            path: 'nuevo',
            loadComponent: () => import('./components/cursos/abm-cursos/abm-cursos.component').then(m => m.AbmCursosComponent)
          },
          {
            path: 'editar/:id',
            loadComponent: () => import('./components/cursos/abm-cursos/abm-cursos.component').then(m => m.AbmCursosComponent)
          }
        ]
      },
      {
        path: 'inscripciones',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/inscripciones/lista-inscripciones/lista-inscripciones.component').then(m => m.ListaInscripcionesComponent)
          },
          {
            path: 'alumno/:id',
            loadComponent: () => import('./components/inscripciones/nueva-inscripcion/nueva-inscripcion.component').then(m => m.NuevaInscripcionComponent)
          }
        ]
      },
      {
        path: 'notas',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/notas/lista-notas/lista-notas.component').then(m => m.ListaNotasComponent)
          },
          {
            path: 'editar/:alumnoId/:cursoId',
            loadComponent: () => import('./components/notas/editar-nota/editar-nota.component').then(m => m.EditarNotaComponent)
          }
        ]
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./features/usuarios/usuarios.module').then(m => m.UsuariosModule),
        canActivate: [AuthGuard, AdminGuard]
      },
      { path: '', redirectTo: 'alumnos', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
