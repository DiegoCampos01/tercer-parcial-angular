import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NotasService } from '../../services/notas.service';
import { AlumnosService } from '../../../../services/alumnos.service';
import { CursosService } from '../../../../services/cursos.service';
import { InscripcionesService } from '../../../../services/inscripciones.service';
import { Subscription } from 'rxjs';

interface NotaViewModel {
  id?: number;
  alumnoId: number;
  cursoId: number;
  nombreAlumno: string;
  nombreCurso: string;
  calificacion: number | null;
  estado?: string;
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './lista-notas.component.html',
  styleUrls: ['./lista-notas.component.scss']
})
export class ListaNotasComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['alumno', 'curso', 'calificacion', 'estado', 'acciones'];
  notas: NotaViewModel[] = [];
  notaSeleccionada: NotaViewModel | null = null;
  nuevaNota: number | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private alumnosService: AlumnosService,
    private cursosService: CursosService,
    private notasService: NotasService,
    private inscripcionesService: InscripcionesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarNotas();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  cargarNotas(): void {
    this.subscriptions.push(
      this.inscripcionesService.getInscripciones().subscribe(inscripciones => {
        this.notas = [];
        inscripciones.forEach(inscripcion => {
          const alumno = this.alumnosService.getAlumnoById(inscripcion.alumnoId);
          const curso = this.cursosService.getCursoById(inscripcion.cursoId);
          
          if (alumno && curso) {
            const notaExistente = this.notasService.getNotaPorAlumnoYCurso(inscripcion.alumnoId, inscripcion.cursoId);
            
            this.notas.push({
              id: notaExistente?.id,
              alumnoId: inscripcion.alumnoId,
              cursoId: inscripcion.cursoId,
              nombreAlumno: `${alumno.nombre} ${alumno.apellido}`,
              nombreCurso: curso.nombre,
              calificacion: notaExistente?.calificacion || null,
              estado: notaExistente ? this.getEstadoNota(notaExistente.calificacion) : 'Pendiente'
            });
          }
        });
      })
    );
  }

  editarNota(nota: NotaViewModel): void {
    this.notaSeleccionada = nota;
    this.nuevaNota = nota.calificacion;
  }

  cancelarEdicion(): void {
    this.notaSeleccionada = null;
    this.nuevaNota = null;
  }

  guardarNota(): void {
    if (!this.notaSeleccionada || this.nuevaNota === null) return;

    if (this.nuevaNota < 0 || this.nuevaNota > 5) {
      this.snackBar.open('La calificación debe estar entre 0 y 5', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.notasService.agregarNota(
      this.notaSeleccionada.alumnoId,
      this.notaSeleccionada.cursoId,
      this.nuevaNota
    );

    this.cargarNotas();
    this.notaSeleccionada = null;
    this.nuevaNota = null;

    this.snackBar.open('Nota guardada correctamente', 'Cerrar', {
      duration: 3000
    });
  }

  getEstadoNota(calificacion: number): string {
    return calificacion >= 3.0 ? 'APROBADO' : 'REPROBADO';
  }

  getColorNota(calificacion: number | null): string {
    if (calificacion === null) return '';
    return calificacion >= 3.0 ? 'success' : 'danger';
  }
} 