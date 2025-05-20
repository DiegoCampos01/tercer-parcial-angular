import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { NombreCompletoPipe } from '../../../pipes/nombre-completo.pipe';
import { Alumno } from '../../../models/alumno.model';
import { TituloGrandeDirective } from '../../../directives/titulo-grande.directive';
import { AlumnosService } from '../../../services/alumnos.service';
import { CursosService } from '../../../services/cursos.service';
import { InscripcionesService } from '../../../services/inscripciones.service';
import { NotasService } from '../../../services/notas.service';
import { Curso } from '../../../models/curso.model';

@Component({
  selector: 'app-lista-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    NombreCompletoPipe,
    TituloGrandeDirective
  ],
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.scss']
})
export class ListaAlumnosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'email', 'fechaNacimiento', 'cursosInscritos', 'acciones'];
  alumnos: Alumno[] = [];
  cursos: { [key: number]: Curso } = {};

  constructor(
    private alumnosService: AlumnosService,
    private cursosService: CursosService,
    private inscripcionesService: InscripcionesService,
    private notasService: NotasService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.alumnosService.getAlumnos().subscribe(alumnos => {
      this.alumnos = alumnos;
    });

    this.cursosService.getCursos().subscribe(cursos => {
      this.cursos = cursos.reduce((acc, curso) => {
        acc[curso.id] = curso;
        return acc;
      }, {} as { [key: number]: Curso });
    });
  }

  getCursosAlumno(alumnoId: number): Curso[] {
    return Object.values(this.cursos).filter(curso => 
      curso.alumnos?.includes(alumnoId)
    );
  }

  getNotaCurso(alumnoId: number, cursoId: number): number | null {
    const nota = this.notasService.getNotaPorAlumnoYCurso(alumnoId, cursoId);
    return nota ? nota.calificacion : null;
  }

  getCalificacionColor(calificacion: number): string {
    return calificacion >= 3.0 ? 'success' : 'danger';
  }

  getCalificacionEstado(calificacion: number): string {
    return calificacion >= 3.0 ? 'APROBADO' : 'REPROBADO';
  }

  editarAlumno(alumno: Alumno): void {
    console.log('Editar alumno:', alumno);
  }

  eliminarAlumno(alumno: Alumno): void {
    if (confirm(`¿Está seguro de eliminar al alumno ${alumno.nombre} ${alumno.apellido}?`)) {
      this.alumnosService.eliminarAlumno(alumno.id);
    }
  }
} 