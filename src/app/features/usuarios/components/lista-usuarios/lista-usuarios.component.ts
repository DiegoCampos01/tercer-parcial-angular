import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from '../../services/usuarios.service';
import { User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <h2>Lista de Usuarios</h2>
      
      <table mat-table [dataSource]="usuarios" class="mat-elevation-z8">
        <!-- ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let usuario">{{usuario.id}}</td>
        </ng-container>

        <!-- Username Column -->
        <ng-container matColumnDef="username">
          <th mat-header-cell *matHeaderCellDef>Usuario</th>
          <td mat-cell *matCellDef="let usuario">{{usuario.username}}</td>
        </ng-container>

        <!-- Email Column -->
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let usuario">{{usuario.email}}</td>
        </ng-container>

        <!-- Role Column -->
        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef>Rol</th>
          <td mat-cell *matCellDef="let usuario">{{usuario.role}}</td>
        </ng-container>

        <!-- Acciones Column -->
        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let usuario">
            <button mat-icon-button color="primary" [routerLink]="['/usuarios/editar', usuario.id]">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="eliminarUsuario(usuario)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    table {
      width: 100%;
    }
  `]
})
export class ListaUsuariosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'acciones'];
  usuarios: User[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarUsuario(usuario: User): void {
    if (confirm(`¿Está seguro de eliminar al usuario ${usuario.username}?`)) {
      this.usuariosService.eliminarUsuario(usuario.id).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
} 