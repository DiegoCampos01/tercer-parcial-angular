import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { AbmUsuariosComponent } from './components/abm-usuarios/abm-usuarios.component';
import { AdminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ListaUsuariosComponent },
      { path: 'nuevo', component: AbmUsuariosComponent },
      { path: 'editar/:id', component: AbmUsuariosComponent }
    ],
    canActivate: [AdminGuard]
  }
];

@NgModule({
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
    MatSnackBarModule,
    ListaUsuariosComponent,
    AbmUsuariosComponent
  ]
})
export class UsuariosModule { } 