import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface Curso {
  id: number;
  nombre: string;
  profesor: string;
  horario: string;
  aula: string;
}

interface Alumno {
  id: number;
  nombreCompleto: string;
  email: string;
  edad: number;
  calificacion: string;
}

@Component({
  selector: 'app-lista-materias',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './lista-materias.component.html',
  styleUrls: ['./lista-materias.component.scss']
})
export class ListaMateriasComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'profesor', 'horario', 'aula', 'acciones'];
  cursos: Curso[] = [
    { id: 1, nombre: 'Matemáticas Avanzadas', profesor: 'Dr. García', horario: 'Lunes y Miércoles 8:00-10:00', aula: 'A-101' },
    { id: 2, nombre: 'Física Cuántica', profesor: 'Dra. Rodríguez', horario: 'Martes y Jueves 10:00-12:00', aula: 'B-203' },
    { id: 3, nombre: 'Programación Web', profesor: 'Ing. Martínez', horario: 'Viernes 14:00-18:00', aula: 'Lab-01' }
  ];

  alumnosPorCurso: { [key: number]: Alumno[] } = {
    1: [ // Matemáticas Avanzadas
      { id: 1, nombreCompleto: 'Juan Pérez', email: 'juan@email.com', edad: 20, calificacion: '4.5 - APROBADO' },
      { id: 2, nombreCompleto: 'María Gómez', email: 'maria@email.com', edad: 22, calificacion: '2.8 - REPROBADO' },
      { id: 3, nombreCompleto: 'Carlos López', email: 'carlos@email.com', edad: 21, calificacion: '3.2 - APROBADO' }
    ],
    2: [ // Física Cuántica
      { id: 1, nombreCompleto: 'Juan Pérez', email: 'juan@email.com', edad: 20, calificacion: '4.5 - APROBADO' },
      { id: 3, nombreCompleto: 'Carlos López', email: 'carlos@email.com', edad: 21, calificacion: '3.2 - APROBADO' }
    ],
    3: [ // Programación Web
      { id: 2, nombreCompleto: 'María Gómez', email: 'maria@email.com', edad: 22, calificacion: '2.8 - REPROBADO' },
      { id: 3, nombreCompleto: 'Carlos López', email: 'carlos@email.com', edad: 21, calificacion: '3.2 - APROBADO' }
    ]
  };

  mostrarAlumnos = false;
  cursoSeleccionado: number | null = null;
  alumnosDisplayedColumns: string[] = ['id', 'nombreCompleto', 'email', 'edad', 'calificacion', 'acciones'];
  alumnosActuales: Alumno[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  verAlumnos(cursoId: number): void {
    this.cursoSeleccionado = cursoId;
    this.alumnosActuales = this.alumnosPorCurso[cursoId];
    this.mostrarAlumnos = true;
  }

  editarAlumno(alumno: Alumno): void {
    console.log('Editando alumno:', alumno);
  }

  eliminarAlumno(alumno: Alumno): void {
    console.log('Eliminando alumno:', alumno);
  }
}
