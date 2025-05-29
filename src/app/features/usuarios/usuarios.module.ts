import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { AdminGuard } from '../../guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/lista-usuarios/lista-usuarios.module').then(m => m.ListaUsuariosModule),
        canActivate: [AdminGuard]
      },
      {
        path: 'nuevo',
        loadChildren: () => import('./pages/crear-usuario/crear-usuario.module').then(m => m.CrearUsuarioModule),
        canActivate: [AdminGuard]
      },
      {
        path: 'editar/:id',
        loadChildren: () => import('./pages/crear-usuario/crear-usuario.module').then(m => m.CrearUsuarioModule),
        canActivate: [AdminGuard]
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule
  ]
})
export class UsuariosModule { } 