import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotasService } from '../../services/notas.service';

interface Nota {
  id: number;
  alumnoId: number;
  cursoId: number;
  calificacion: number;
  fecha: Date;
  alumno?: {
    nombre: string;
    apellido: string;
  };
  curso?: {
    nombre: string;
  };
}

@Component({
  selector: 'app-lista-notas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <h2>Calificaciones</h2>

      <div class="filtros">
        <mat-form-field appearance="outline">
          <mat-label>Curso</mat-label>
          <mat-select [(ngModel)]="cursoSeleccionado" (selectionChange)="cargarNotas()">
            <mat-option [value]="null">Todos los cursos</mat-option>
            <mat-option *ngFor="let curso of cursos" [value]="curso.id">
              {{curso.nombre}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <table mat-table [dataSource]="notas" class="mat-elevation-z8">
        <!-- Alumno Column -->
        <ng-container matColumnDef="alumno">
          <th mat-header-cell *matHeaderCellDef>Alumno</th>
          <td mat-cell *matCellDef="let nota">{{nota.alumno?.nombre}} {{nota.alumno?.apellido}}</td>
        </ng-container>

        <!-- Curso Column -->
        <ng-container matColumnDef="curso">
          <th mat-header-cell *matHeaderCellDef>Curso</th>
          <td mat-cell *matCellDef="let nota">{{nota.curso?.nombre}}</td>
        </ng-container>

        <!-- Calificación Column -->
        <ng-container matColumnDef="calificacion">
          <th mat-header-cell *matHeaderCellDef>Calificación</th>
          <td mat-cell *matCellDef="let nota">
            <ng-container *ngIf="editandoId === nota.id; else mostrarCalificacion">
              <form [formGroup]="notaForm" (ngSubmit)="guardarNota(nota)">
                <mat-form-field appearance="outline">
                  <input matInput type="number" formControlName="calificacion" min="0" max="10" step="0.1">
                  <mat-error *ngIf="notaForm.get('calificacion')?.hasError('required')">
                    La calificación es requerida
                  </mat-error>
                  <mat-error *ngIf="notaForm.get('calificacion')?.hasError('min') || notaForm.get('calificacion')?.hasError('max')">
                    La calificación debe estar entre 0 y 10
                  </mat-error>
                </mat-form-field>
                <button mat-icon-button color="primary" type="submit" [disabled]="notaForm.invalid">
                  <mat-icon>check</mat-icon>
                </button>
                <button mat-icon-button color="warn" type="button" (click)="cancelarEdicion()">
                  <mat-icon>close</mat-icon>
                </button>
              </form>
            </ng-container>
            <ng-template #mostrarCalificacion>
              {{nota.calificacion}}
            </ng-template>
          </td>
        </ng-container>

        <!-- Fecha Column -->
        <ng-container matColumnDef="fecha">
          <th mat-header-cell *matHeaderCellDef>Fecha</th>
          <td mat-cell *matCellDef="let nota">{{nota.fecha | date:'dd/MM/yyyy'}}</td>
        </ng-container>

        <!-- Acciones Column -->
        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let nota">
            <button mat-icon-button color="primary" (click)="editarNota(nota)" *ngIf="editandoId !== nota.id">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="eliminarNota(nota)" *ngIf="editandoId !== nota.id">
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
    .filtros {
      margin-bottom: 20px;
      display: flex;
      gap: 20px;
    }
    table {
      width: 100%;
    }
    mat-form-field {
      width: 100px;
    }
    form {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class ListaNotasComponent implements OnInit {
  displayedColumns: string[] = ['alumno', 'curso', 'calificacion', 'fecha', 'acciones'];
  notas: Nota[] = [];
  cursos: any[] = []; // Mantenemos cursos para el filtro, se cargarán por separado o se simularán
  cursoSeleccionado: number | null = null;
  editandoId: number | null = null;
  notaForm: FormGroup;

  constructor(
    private notasService: NotasService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.notaForm = this.fb.group({
      calificacion: ['', [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    // Solo cargar notas, que ya deberían venir con info de alumno/curso
    this.cargarNotas();
    // TODO: Cargar cursos para el filtro. Por ahora usamos datos simulados en el servicio.
  }

  cargarNotas(): void {
    this.notasService.getNotas(this.cursoSeleccionado).subscribe({
      next: (notas) => {
        this.notas = notas; // Asignamos directamente las notas recibidas
        console.log('Notas cargadas:', this.notas); // Añadimos este log
      },
      error: (error) => {
        this.snackBar.open('Error al cargar calificaciones', 'Cerrar', { duration: 3000 });
        console.error(error); // Log the error for debugging
      }
    });
  }

  editarNota(nota: Nota): void {
    this.editandoId = nota.id;
    this.notaForm.patchValue({
      calificacion: nota.calificacion
    });
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.notaForm.reset();
  }

  guardarNota(nota: Nota): void {
    if (this.notaForm.valid) {
      const calificacion = this.notaForm.get('calificacion')?.value;
      this.notasService.actualizarNota(nota.id, { calificacion }).subscribe({
        next: () => {
          this.snackBar.open('Calificación actualizada correctamente', 'Cerrar', { duration: 3000 });
          this.editandoId = null;
          this.cargarNotas();
        },
        error: (error) => {
          this.snackBar.open('Error al actualizar calificación', 'Cerrar', { duration: 3000 });
          console.error(error); // Log the error for debugging
        }
      });
    }
  }

  eliminarNota(nota: Nota): void {
    if (confirm('¿Está seguro de eliminar esta calificación?')) {
      this.notasService.eliminarNota(nota.id).subscribe({
        next: () => {
          this.snackBar.open('Calificación eliminada correctamente', 'Cerrar', { duration: 3000 });
          this.cargarNotas();
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar calificación', 'Cerrar', { duration: 3000 });
          console.error(error); // Log the error for debugging
        }
      });
    }
  }
} 