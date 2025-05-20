import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Curso } from '../../../models/curso.model';
import { CursosService } from '../../../services/cursos.service';

@Component({
  selector: 'app-lista-cursos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './lista-cursos.component.html',
  styleUrls: ['./lista-cursos.component.scss']
})
export class ListaCursosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'profesor', 'duracion', 'acciones'];
  cursos: Curso[] = [];

  constructor(private cursosService: CursosService) {}

  ngOnInit(): void {
    this.cursosService.getCursos().subscribe(cursos => {
      this.cursos = cursos;
    });
  }

  editarCurso(curso: Curso): void {
    console.log('Editar curso:', curso);
  }

  eliminarCurso(curso: Curso): void {
    if (confirm(`¿Está seguro de eliminar el curso ${curso.nombre}?`)) {
      this.cursosService.eliminarCurso(curso.id);
    }
  }

  verAlumnos(curso: Curso): void {
    console.log('Ver alumnos del curso:', curso);
  }
} 