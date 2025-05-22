import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuariosService } from '../../services/usuarios.service';
import { User } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-abm-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <div class="container">
      <h2>{{ esEdicion ? 'Editar' : 'Nuevo' }} Usuario</h2>
      
      <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Usuario</mat-label>
          <input matInput formControlName="username" required>
          <mat-error *ngIf="usuarioForm.get('username')?.hasError('required')">
            El usuario es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" required type="email">
          <mat-error *ngIf="usuarioForm.get('email')?.hasError('required')">
            El email es requerido
          </mat-error>
          <mat-error *ngIf="usuarioForm.get('email')?.hasError('email')">
            El email no es válido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contraseña</mat-label>
          <input matInput formControlName="password" type="password" [required]="!esEdicion">
          <mat-error *ngIf="usuarioForm.get('password')?.hasError('required')">
            La contraseña es requerida
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="role" required>
            <mat-option value="admin">Administrador</mat-option>
            <mat-option value="user">Usuario</mat-option>
          </mat-select>
          <mat-error *ngIf="usuarioForm.get('role')?.hasError('required')">
            El rol es requerido
          </mat-error>
        </mat-form-field>

        <div class="button-container">
          <button mat-button type="button" (click)="volver()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="usuarioForm.invalid">
            {{ esEdicion ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 16px;
    }
  `]
})
export class AbmUsuariosComponent implements OnInit {
  usuarioForm: FormGroup;
  esEdicion = false;
  usuarioId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar
  ) {
    this.usuarioForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.esEdicion ? [] : Validators.required],
      role: ['user', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.usuarioId = +id;
      this.cargarUsuario(this.usuarioId);
    }
  }

  cargarUsuario(id: number): void {
    this.usuariosService.getUsuarioById(id).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue({
          username: usuario.username,
          email: usuario.email,
          role: usuario.role
        });
      },
      error: (error) => {
        this.snackBar.open('Error al cargar usuario', 'Cerrar', { duration: 3000 });
        this.volver();
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const usuarioData = this.usuarioForm.value;
      
      if (this.esEdicion && this.usuarioId) {
        if (!usuarioData.password) {
          delete usuarioData.password;
        }
        this.usuariosService.actualizarUsuario(this.usuarioId, usuarioData).subscribe({
          next: () => {
            this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', { duration: 3000 });
            this.volver();
          },
          error: (error) => {
            this.snackBar.open('Error al actualizar usuario', 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        this.usuariosService.crearUsuario(usuarioData).subscribe({
          next: () => {
            this.snackBar.open('Usuario creado correctamente', 'Cerrar', { duration: 3000 });
            this.volver();
          },
          error: (error) => {
            this.snackBar.open('Error al crear usuario', 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }

  volver(): void {
    this.router.navigate(['/usuarios']);
  }
} 