import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Curso } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private readonly STORAGE_KEY = 'cursos';
  private cursosSubject = new BehaviorSubject<Curso[]>([]);

  constructor() {
    this.cargarCursos();
  }

  private cargarCursos(): void {
    const cursosGuardados = localStorage.getItem(this.STORAGE_KEY);
    if (cursosGuardados) {
      const cursos = JSON.parse(cursosGuardados);
      this.cursosSubject.next(cursos);
    } else {
      // Datos iniciales si no hay datos guardados
      const cursosIniciales: Curso[] = [
        {
          id: 1,
          nombre: 'Matemáticas Avanzadas',
          descripcion: 'Curso avanzado de matemáticas',
          profesor: 'Dr. García',
          duracion: 60,
          alumnos: [],
          cupo: 30
        },
        {
          id: 2,
          nombre: 'Programación Web',
          descripcion: 'Desarrollo web moderno',
          profesor: 'Ing. Martínez',
          duracion: 40,
          alumnos: [],
          cupo: 25
        }
      ];
      this.cursosSubject.next(cursosIniciales);
      this.guardarCursos();
    }
  }

  private guardarCursos(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cursosSubject.value));
  }

  getCursos(): Observable<Curso[]> {
    return this.cursosSubject.asObservable();
  }

  getCursoById(id: number): Curso | undefined {
    return this.cursosSubject.value.find(curso => curso.id === id);
  }

  private generarNuevoId(): number {
    const cursos = this.cursosSubject.value;
    return cursos.length > 0 ? Math.max(...cursos.map(c => c.id)) + 1 : 1;
  }

  agregarCurso(curso: Omit<Curso, 'id' | 'alumnos'>): void {
    const nuevoCurso: Curso = {
      ...curso,
      id: this.generarNuevoId(),
      alumnos: []
    };
    const cursos = [...this.cursosSubject.value, nuevoCurso];
    this.cursosSubject.next(cursos);
    this.guardarCursos();
  }

  actualizarCurso(curso: Curso): void {
    const cursos = this.cursosSubject.value.map(c => 
      c.id === curso.id ? curso : c
    );
    this.cursosSubject.next(cursos);
    this.guardarCursos();
  }

  eliminarCurso(id: number): void {
    const cursos = this.cursosSubject.value.filter(c => c.id !== id);
    this.cursosSubject.next(cursos);
    this.guardarCursos();
  }

  agregarAlumno(cursoId: number, alumnoId: number): void {
    const cursos = this.cursosSubject.value.map(curso => {
      if (curso.id === cursoId && !curso.alumnos.includes(alumnoId)) {
        return {
          ...curso,
          alumnos: [...curso.alumnos, alumnoId]
        };
      }
      return curso;
    });
    this.cursosSubject.next(cursos);
    this.guardarCursos();
  }

  removerAlumno(cursoId: number, alumnoId: number): void {
    const cursos = this.cursosSubject.value.map(curso => {
      if (curso.id === cursoId) {
        return {
          ...curso,
          alumnos: curso.alumnos.filter(id => id !== alumnoId)
        };
      }
      return curso;
    });
    this.cursosSubject.next(cursos);
    this.guardarCursos();
  }
} 