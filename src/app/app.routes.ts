import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ListaAlumnosComponent } from './components/alumnos/lista-alumnos/lista-alumnos.component';
import { AbmAlumnosComponent } from './components/alumnos/abm-alumnos/abm-alumnos.component';
import { ListaCursosComponent } from './components/cursos/lista-cursos/lista-cursos.component';
import { AbmCursosComponent } from './components/cursos/abm-cursos/abm-cursos.component';
import { ListaClasesComponent } from './components/clases/lista-clases/lista-clases.component';
import { AbmClasesComponent } from './components/clases/abm-clases/abm-clases.component';
import { CalendarioClasesComponent } from './components/clases/calendario-clases/calendario-clases.component';
import { ListaInscripcionesComponent } from './components/inscripciones/lista-inscripciones/lista-inscripciones.component';
import { ListaNotasComponent } from './components/notas/lista-notas/lista-notas.component';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: '',
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
        path: 'clases',
        loadChildren: () => import('./features/clases/clases.module').then(m => m.ClasesModule)
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
        loadChildren: () => import('./features/usuarios/usuarios.module').then(m => m.UsuariosModule),
        canActivate: [AdminGuard]
      },
      {
        path: '',
        redirectTo: 'alumnos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'alumnos/nuevo', 
    component: AbmAlumnosComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'alumnos/editar/:id', 
    component: AbmAlumnosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cursos/nuevo',
    component: AbmCursosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cursos/editar/:id',
    component: AbmCursosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clases/calendario',
    component: CalendarioClasesComponent,
    canActivate: [AuthGuard]
  }
];
