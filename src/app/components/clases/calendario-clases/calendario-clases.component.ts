import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Clase } from '../../../models/clase.model';
import { ClasesService } from '../../../services/clases.service';
import { CursosService } from '../../../services/cursos.service';
import { Curso } from '../../../models/curso.model';

@Component({
  selector: 'app-calendario-clases',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './calendario-clases.component.html',
  styleUrls: ['./calendario-clases.component.scss']
})
export class CalendarioClasesComponent implements OnInit {
  clases: Clase[] = [];
  cursos: { [key: number]: string } = {};
  fechaActual: Date = new Date();
  diasSemana: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horas: string[] = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);

  constructor(
    private clasesService: ClasesService,
    private cursosService: CursosService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.clasesService.getClases().subscribe(clases => {
      this.clases = clases;
    });

    this.cursosService.getCursos().subscribe(cursos => {
      this.cursos = cursos.reduce((acc, curso) => {
        acc[curso.id] = curso.nombre;
        return acc;
      }, {} as { [key: number]: string });
    });
  }

  getClasesPorDia(dia: number): Clase[] {
    return this.clases.filter(clase => {
      const fechaClase = new Date(clase.fecha);
      return fechaClase.getDay() === dia;
    });
  }

  getClasesPorHora(dia: number, hora: string): Clase[] {
    const [horaInicio] = hora.split(':').map(Number);
    return this.getClasesPorDia(dia).filter(clase => {
      const fechaClase = new Date(clase.fecha);
      return fechaClase.getHours() === horaInicio;
    });
  }

  getNombreCurso(cursoId: number): string {
    return this.cursos[cursoId] || 'Curso no encontrado';
  }

  verDetalleClase(clase: Clase): void {
    // Aquí podríamos abrir un diálogo con los detalles de la clase
    console.log('Ver detalles de la clase:', clase);
  }
} 