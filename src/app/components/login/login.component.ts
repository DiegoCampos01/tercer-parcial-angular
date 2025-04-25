import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Universidad Patito</mat-card-title>
          <mat-card-subtitle>Iniciar Sesión</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="credentials-info">
            <strong>Credenciales de prueba:</strong><br>
            Email: profesor&#64;universidad.com<br>
            Contraseña: 123456
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Correo Electrónico</mat-label>
              <input matInput formControlName="email" type="email">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                El correo es requerido
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Ingrese un correo válido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password" type="password">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width"
                    [disabled]="loginForm.invalid">
              Iniciar Sesión
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #673ab7;
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      margin: 20px;
      padding: 20px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .credentials-info {
      background-color: #e3f2fd;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    mat-card-header {
      margin-bottom: 20px;
    }
    mat-card-title {
      font-size: 24px;
      margin-bottom: 8px !important;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      if (this.authService.login(email, password)) {
        this.router.navigate(['/alumnos']);
      } else {
        alert('Credenciales incorrectas');
      }
    }
  }
} 