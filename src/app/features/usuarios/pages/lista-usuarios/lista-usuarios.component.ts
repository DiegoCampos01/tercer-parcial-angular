import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Usuario } from '../../../../models/usuario.model';
import { AuthService } from '../../../../services/auth.service';
import { UsuariosService } from '../../../../services/usuarios.service';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Usuarios</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="usuarios" class="mat-elevation-z8">
          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef> Nombre </th>
            <td mat-cell *matCellDef="let usuario"> {{usuario.nombre}} </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef> Email </th>
            <td mat-cell *matCellDef="let usuario"> {{usuario.email}} </td>
          </ng-container>

          <ng-container matColumnDef="rol">
            <th mat-header-cell *matHeaderCellDef> Rol </th>
            <td mat-cell *matCellDef="let usuario"> {{usuario.rol}} </td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef> Acciones </th>
            <td mat-cell *matCellDef="let usuario">
              <button mat-icon-button color="primary" (click)="verDetalle(usuario)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="accent" (click)="editarUsuario(usuario)" *ngIf="isAdmin">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="eliminarUsuario(usuario)" *ngIf="isAdmin">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="columnas"></tr>
          <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
        </table>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="nuevoUsuario()" *ngIf="isAdmin">
          Nuevo Usuario
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    table {
      width: 100%;
    }
    .mat-card {
      margin: 20px;
    }
  `]
})
export class ListaUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  columnas: string[] = ['nombre', 'email', 'rol', 'acciones'];
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }

  verDetalle(usuario: Usuario): void {
    // Implementar vista detalle
  }

  editarUsuario(usuario: Usuario): void {
    this.router.navigate(['/usuarios/editar', usuario.id]);
  }

  eliminarUsuario(usuario: Usuario): void {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      this.usuariosService.eliminarUsuario(usuario.id).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }

  nuevoUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }
} 