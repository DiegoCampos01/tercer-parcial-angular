import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from '../../../../models/usuario.model';
import { UsuariosService } from '../../../../services/usuarios.service';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ editando ? 'Editar' : 'Crear' }} Usuario</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="usuarioForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="nombre" required>
            <mat-error *ngIf="usuarioForm.get('nombre')?.hasError('required')">
              El nombre es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" required type="email">
            <mat-error *ngIf="usuarioForm.get('email')?.hasError('required')">
              El email es requerido
            </mat-error>
            <mat-error *ngIf="usuarioForm.get('email')?.hasError('email')">
              Email inválido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Contraseña</mat-label>
            <input matInput formControlName="password" required type="password">
            <mat-error *ngIf="usuarioForm.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Rol</mat-label>
            <mat-select formControlName="rol" required>
              <mat-option value="admin">Administrador</mat-option>
              <mat-option value="usuario">Usuario</mat-option>
            </mat-select>
            <mat-error *ngIf="usuarioForm.get('rol')?.hasError('required')">
              El rol es requerido
            </mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="!usuarioForm.valid">
              {{ editando ? 'Actualizar' : 'Crear' }}
            </button>
            <button mat-button type="button" (click)="cancelar()">
              Cancelar
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
    mat-card {
      margin: 20px;
    }
  `]
})
export class CrearUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  editando = false;
  usuarioId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rol: ['usuario', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.usuarioId = +id;
      this.usuariosService.getUsuario(this.usuarioId).subscribe(usuario => {
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        });
        // No cargamos la contraseña por seguridad
        this.usuarioForm.get('password')?.clearValidators();
        this.usuarioForm.get('password')?.updateValueAndValidity();
      });
    }
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const usuario: Usuario = this.usuarioForm.value;
      
      if (this.editando && this.usuarioId) {
        this.usuariosService.actualizarUsuario(this.usuarioId, usuario).subscribe(() => {
          this.router.navigate(['/usuarios']);
        });
      } else {
        this.usuariosService.crearUsuario(usuario).subscribe(() => {
          this.router.navigate(['/usuarios']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }
} 