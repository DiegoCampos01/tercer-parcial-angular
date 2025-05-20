import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Curso } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private readonly STORAGE_KEY = 'cursos';
  private cursos: Curso[] = [];
  private cursosSubject = new BehaviorSubject<Curso[]>([]);

  constructor() {
    this.cargarCursos();
  }

  private cargarCursos(): void {
    const cursosGuardados = localStorage.getItem(this.STORAGE_KEY);
    if (cursosGuardados) {
      this.cursos = JSON.parse(cursosGuardados);
    } else {
      // Datos de ejemplo
      this.cursos = [
        {
          id: 1,
          nombre: 'Matemáticas Avanzadas',
          descripcion: 'Curso avanzado de matemáticas',
          profesor: 'Dr. García',
          duracion: 60,
          alumnos: []
        },
        {
          id: 2,
          nombre: 'Programación Web',
          descripcion: 'Desarrollo web moderno',
          profesor: 'Ing. Martínez',
          duracion: 40,
          alumnos: []
        },
        {
          id: 3,
          nombre: 'Cómo pelar una naranja',
          descripcion: 'Técnicas avanzadas de pelado de naranjas',
          profesor: 'Abe Simpson',
          duracion: 40,
          alumnos: []
        }
      ];
    }
    this.cursosSubject.next(this.cursos);
  }

  private guardarCursos(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cursos));
    this.cursosSubject.next(this.cursos);
  }

  getCursos(): Observable<Curso[]> {
    return this.cursosSubject.asObservable();
  }

  getCursoById(id: number): Curso | undefined {
    return this.cursos.find(c => c.id === id);
  }

  agregarCurso(curso: Omit<Curso, 'id' | 'alumnos'>): void {
    const nuevoCurso: Curso = {
      ...curso,
      id: this.generarNuevoId(),
      alumnos: []
    };
    this.cursos.push(nuevoCurso);
    this.guardarCursos();
  }

  private generarNuevoId(): number {
    return Math.max(...this.cursos.map(c => c.id), 0) + 1;
  }

  actualizarCurso(curso: Curso): void {
    const index = this.cursos.findIndex(c => c.id === curso.id);
    if (index !== -1) {
      this.cursos[index] = curso;
      this.guardarCursos();
    }
  }

  eliminarCurso(id: number): void {
    this.cursos = this.cursos.filter(c => c.id !== id);
    this.guardarCursos();
  }

  inscribirAlumno(cursoId: number, alumnoId: number): void {
    const curso = this.getCursoById(cursoId);
    if (curso) {
      if (!curso.alumnos) {
        curso.alumnos = [];
      }
      if (!curso.alumnos.includes(alumnoId)) {
        curso.alumnos.push(alumnoId);
        this.guardarCursos();
      }
    }
  }

  desinscribirAlumno(cursoId: number, alumnoId: number): void {
    const curso = this.getCursoById(cursoId);
    if (curso && curso.alumnos) {
      curso.alumnos = curso.alumnos.filter(id => id !== alumnoId);
      this.guardarCursos();
    }
  }
} 