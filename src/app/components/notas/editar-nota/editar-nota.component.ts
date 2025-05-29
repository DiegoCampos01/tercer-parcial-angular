import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { NotasService } from '../../../services/notas.service';
import { AlumnosService } from '../../../services/alumnos.service';
import { CursosService } from '../../../services/cursos.service';

@Component({
  selector: 'app-editar-nota',
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
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Calificar Alumno</mat-card-title>
          <mat-card-subtitle *ngIf="nombreAlumno && nombreCurso">
            {{ nombreAlumno }} - {{ nombreCurso }}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="notaForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Calificación</mat-label>
              <input matInput type="number" formControlName="calificacion" min="0" max="5" step="0.1">
              <mat-error *ngIf="notaForm.get('calificacion')?.hasError('required')">
                La calificación es requerida
              </mat-error>
              <mat-error *ngIf="notaForm.get('calificacion')?.hasError('min')">
                La calificación mínima es 0
              </mat-error>
              <mat-error *ngIf="notaForm.get('calificacion')?.hasError('max')">
                La calificación máxima es 5
              </mat-error>
            </mat-form-field>

            <div class="button-container">
              <button mat-button type="button" (click)="cancelar()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!notaForm.valid">
                Guardar Calificación
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
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
      margin-bottom: 20px;
    }
    .button-container {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `]
})
export class EditarNotaComponent implements OnInit {
  notaForm: FormGroup;
  alumnoId: number | null = null;
  cursoId: number | null = null;
  nombreAlumno: string = '';
  nombreCurso: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notasService: NotasService,
    private alumnosService: AlumnosService,
    private cursosService: CursosService
  ) {
    this.notaForm = this.fb.group({
      calificacion: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.alumnoId = Number(this.route.snapshot.paramMap.get('alumnoId'));
    this.cursoId = Number(this.route.snapshot.paramMap.get('cursoId'));

    if (this.alumnoId && this.cursoId) {
      const alumno = this.alumnosService.getAlumnoById(this.alumnoId);
      const curso = this.cursosService.getCursoById(this.cursoId);
      
      if (alumno && curso) {
        this.nombreAlumno = `${alumno.nombre} ${alumno.apellido}`;
        this.nombreCurso = curso.nombre;
        
        const notaActual = this.notasService.getNotaPorAlumnoYCurso(this.alumnoId, this.cursoId);
        if (notaActual) {
          this.notaForm.patchValue({
            calificacion: notaActual.calificacion
          });
        }
      } else {
        this.router.navigate(['/notas']);
      }
    } else {
      this.router.navigate(['/notas']);
    }
  }

  onSubmit(): void {
    if (this.notaForm.valid && this.alumnoId && this.cursoId) {
      this.notasService.guardarNota({
        alumnoId: this.alumnoId,
        cursoId: this.cursoId,
        calificacion: this.notaForm.value.calificacion
      });
      this.router.navigate(['/notas']);
    }
  }

  cancelar(): void {
    this.router.navigate(['/notas']);
  }
} 