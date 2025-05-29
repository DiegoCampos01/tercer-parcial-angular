import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CursosService } from '../../../services/cursos.service';
import { InscripcionesService } from '../../../services/inscripciones.service';
import { AlumnosService } from '../../../services/alumnos.service';
import { Curso } from '../../../models/curso.model';
import { Alumno } from '../../../models/alumno.model';

@Component({
  selector: 'app-nueva-inscripcion',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Nueva Inscripción</mat-card-title>
          <mat-card-subtitle *ngIf="alumno">
            Alumno: {{alumno.nombre}} {{alumno.apellido}}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form #inscripcionForm="ngForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill">
              <mat-label>Seleccionar Curso</mat-label>
              <mat-select [(ngModel)]="cursoSeleccionado" name="curso" required>
                <mat-option *ngFor="let curso of cursosDisponibles" [value]="curso.id">
                  {{curso.nombre}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <div class="actions">
              <button mat-button type="button" (click)="cancelar()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!inscripcionForm.valid">
                Inscribir
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
    mat-form-field {
      width: 100%;
      margin-bottom: 20px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class NuevaInscripcionComponent implements OnInit {
  alumno: Alumno | null = null;
  cursosDisponibles: Curso[] = [];
  cursoSeleccionado: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alumnosService: AlumnosService,
    private cursosService: CursosService,
    private inscripcionesService: InscripcionesService
  ) {}

  ngOnInit(): void {
    const alumnoId = Number(this.route.snapshot.paramMap.get('id'));
    const alumnoEncontrado = this.alumnosService.getAlumnoById(alumnoId);
    
    if (alumnoEncontrado) {
      this.alumno = alumnoEncontrado;
      
      // Cargar cursos disponibles
      this.cursosService.getCursos().subscribe(cursos => {
        // Filtrar cursos donde el alumno no está inscrito
        this.cursosDisponibles = cursos.filter(curso => 
          !curso.alumnos?.includes(alumnoId)
        );
      });
    } else {
      this.router.navigate(['/alumnos']);
    }
  }

  onSubmit(): void {
    if (this.alumno && this.cursoSeleccionado) {
      this.inscripcionesService.inscribirAlumno(this.cursoSeleccionado, this.alumno.id).subscribe({
        next: () => {
          this.router.navigate(['/alumnos']);
        },
        error: (error) => {
          console.error('Error al inscribir alumno:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/alumnos']);
  }
} 