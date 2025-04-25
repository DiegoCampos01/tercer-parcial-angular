import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NombreCompletoPipe } from '../../../pipes/nombre-completo.pipe';
import { Alumno } from '../../../models/alumno.model';
import { TituloGrandeDirective } from '../../../directives/titulo-grande.directive';
import { AlumnosService } from '../../../services/alumnos.service';

@Component({
  selector: 'app-lista-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterLink,
    NombreCompletoPipe,
    TituloGrandeDirective
  ],
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.scss']
})
export class ListaAlumnosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombreCompleto', 'email', 'edad', 'calificacion', 'acciones'];
  alumnos: Alumno[] = [];

  constructor(private alumnosService: AlumnosService) {}

  ngOnInit() {
    this.alumnosService.getAlumnos().subscribe(alumnos => {
      this.alumnos = alumnos;
    });
  }

  getCalificacionColor(calificacion: number): string {
    return calificacion >= 3 ? 'text-success' : 'text-danger';
  }

  getCalificacionEstado(calificacion: number): string {
    return calificacion >= 3 ? 'APROBADO' : 'REPROBADO';
  }

  eliminarAlumno(alumno: Alumno) {
    this.alumnosService.eliminarAlumno(alumno.id);
  }
} 