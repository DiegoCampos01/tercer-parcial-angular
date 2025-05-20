import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Clase } from '../../../models/clase.model';
import { ClasesService } from '../../../services/clases.service';
import { CursosService } from '../../../services/cursos.service';
import { Curso } from '../../../models/curso.model';

@Component({
  selector: 'app-lista-clases',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './lista-clases.component.html',
  styleUrls: ['./lista-clases.component.scss']
})
export class ListaClasesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'titulo', 'descripcion', 'fecha', 'duracion', 'aula', 'acciones'];
  clases: Clase[] = [];
  clasesFiltradas: Clase[] = [];
  cursos: { [key: number]: string } = {};
  filtro: string = '';

  constructor(
    private clasesService: ClasesService,
    private cursosService: CursosService
  ) {}

  ngOnInit(): void {
    this.clasesService.getClases().subscribe(clases => {
      this.clases = clases;
      this.aplicarFiltro();
    });

    this.cursosService.getCursos().subscribe(cursos => {
      this.cursos = cursos.reduce((acc, curso) => {
        acc[curso.id] = curso.nombre;
        return acc;
      }, {} as { [key: number]: string });
    });
  }

  aplicarFiltro(): void {
    if (!this.filtro) {
      this.clasesFiltradas = this.clases;
      return;
    }

    const filtroLower = this.filtro.toLowerCase();
    this.clasesFiltradas = this.clases.filter(clase => 
      clase.titulo.toLowerCase().includes(filtroLower) ||
      clase.descripcion.toLowerCase().includes(filtroLower) ||
      clase.aula.toLowerCase().includes(filtroLower) ||
      this.getNombreCurso(clase.cursoId).toLowerCase().includes(filtroLower)
    );
  }

  editarClase(clase: Clase): void {
    console.log('Editar clase:', clase);
  }

  eliminarClase(clase: Clase): void {
    if (confirm(`¿Está seguro de eliminar la clase ${clase.titulo}?`)) {
      this.clasesService.eliminarClase(clase.id);
    }
  }

  getNombreCurso(cursoId: number): string {
    return this.cursos[cursoId] || 'Curso no encontrado';
  }
} 