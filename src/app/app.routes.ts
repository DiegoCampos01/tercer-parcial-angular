import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ListaAlumnosComponent } from './components/alumnos/lista-alumnos/lista-alumnos.component';
import { AbmAlumnosComponent } from './components/alumnos/abm-alumnos/abm-alumnos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'alumnos', 
    component: ListaAlumnosComponent,
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
  }
];
