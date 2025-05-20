import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AlumnosService } from '../../../services/alumnos.service';
import { CursosService } from '../../../services/cursos.service';
import { NotasService } from '../../../services/notas.service';
import { Alumno } from '../../../models/alumno.model';
import { Curso } from '../../../models/curso.model';

interface NotaViewModel {
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
export class ListaNotasComponent implements OnInit {
  displayedColumns: string[] = ['alumno', 'curso', 'calificacion', 'estado', 'acciones'];
  notas: NotaViewModel[] = [];
  alumnos: Alumno[] = [];
  cursos: Curso[] = [];
  notaSeleccionada: NotaViewModel | null = null;
  nuevaNota: number | null = null;

  constructor(
    private alumnosService: AlumnosService,
    private cursosService: CursosService,
    private notasService: NotasService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.alumnosService.getAlumnos().subscribe(alumnos => {
      this.alumnos = alumnos;
      this.actualizarNotas();
    });

    this.cursosService.getCursos().subscribe(cursos => {
      this.cursos = cursos;
      this.actualizarNotas();
    });
  }

  actualizarNotas(): void {
    if (!this.alumnos.length || !this.cursos.length) return;

    this.notas = [];
    this.alumnos.forEach(alumno => {
      this.cursos.forEach(curso => {
        if (curso.alumnos?.includes(alumno.id)) {
          const notaExistente = this.notasService.getNotaPorAlumnoYCurso(alumno.id, curso.id);
          this.notas.push({
            alumnoId: alumno.id,
            cursoId: curso.id,
            nombreAlumno: `${alumno.nombre} ${alumno.apellido}`,
            nombreCurso: curso.nombre,
            calificacion: notaExistente?.calificacion || null,
            estado: notaExistente ? this.notasService.getEstadoNota(notaExistente.calificacion) : undefined
          });
        }
      });
    });
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

    this.actualizarNotas();
    this.notaSeleccionada = null;
    this.nuevaNota = null;

    this.snackBar.open('Nota guardada correctamente', 'Cerrar', {
      duration: 3000
    });
  }

  getColorNota(calificacion: number | null): string {
    if (calificacion === null) return '';
    return this.notasService.getColorNota(calificacion);
  }
} 