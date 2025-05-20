import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alumno } from '../models/alumno.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
  private readonly STORAGE_KEY = 'alumnos';
  private alumnos: Alumno[] = [];
  private alumnosSubject = new BehaviorSubject<Alumno[]>([]);

  constructor() {
    this.cargarAlumnos();
  }

  private cargarAlumnos(): void {
    const alumnosGuardados = localStorage.getItem(this.STORAGE_KEY);
    if (alumnosGuardados) {
      this.alumnos = JSON.parse(alumnosGuardados).map((alumno: any) => ({
        ...alumno,
        fechaNacimiento: new Date(alumno.fechaNacimiento)
      }));
    } else {
      // Datos de ejemplo
      this.alumnos = [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@email.com',
          fechaNacimiento: new Date('1995-05-14'),
          cursos: []
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'González',
          email: 'maria@email.com',
          fechaNacimiento: new Date('2001-05-13'),
          cursos: []
        },
        {
          id: 3,
          nombre: 'Spike',
          apellido: 'Spiegel',
          email: 'spike@email.com',
          fechaNacimiento: new Date('1964-05-05'),
          cursos: []
        }
      ];
    }
    this.alumnosSubject.next(this.alumnos);
  }

  private guardarAlumnos(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alumnos));
    this.alumnosSubject.next(this.alumnos);
  }

  getAlumnos(): Observable<Alumno[]> {
    return this.alumnosSubject.asObservable();
  }

  getAlumnoById(id: number): Alumno | undefined {
    return this.alumnos.find(a => a.id === id);
  }

  agregarAlumno(alumno: Omit<Alumno, 'id' | 'cursos'>): void {
    const nuevoAlumno: Alumno = {
      ...alumno,
      id: this.generarNuevoId(),
      cursos: []
    };
    this.alumnos.push(nuevoAlumno);
    this.guardarAlumnos();
  }

  private generarNuevoId(): number {
    return Math.max(...this.alumnos.map(a => a.id), 0) + 1;
  }

  actualizarAlumno(alumno: Alumno): void {
    const index = this.alumnos.findIndex(a => a.id === alumno.id);
    if (index !== -1) {
      this.alumnos[index] = alumno;
      this.guardarAlumnos();
    }
  }

  eliminarAlumno(id: number): void {
    this.alumnos = this.alumnos.filter(a => a.id !== id);
    this.guardarAlumnos();
  }

  inscribirEnCurso(alumnoId: number, cursoId: number): void {
    const alumno = this.getAlumnoById(alumnoId);
    if (alumno && !alumno.cursos.includes(cursoId)) {
      alumno.cursos.push(cursoId);
      this.guardarAlumnos();
    }
  }

  desinscribirDeCurso(alumnoId: number, cursoId: number): void {
    const alumno = this.getAlumnoById(alumnoId);
    if (alumno) {
      alumno.cursos = alumno.cursos.filter(id => id !== cursoId);
      this.guardarAlumnos();
    }
  }
} 