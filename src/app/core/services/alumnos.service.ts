import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alumno } from '../../models/alumno.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
  private alumnos: Alumno[] = [];
  private alumnosSubject = new BehaviorSubject<Alumno[]>([]);
  private readonly STORAGE_KEY = 'alumnos_data';

  constructor() {
    this.cargarAlumnos();
  }

  private cargarAlumnos(): void {
    const alumnosGuardados = localStorage.getItem(this.STORAGE_KEY);
    if (alumnosGuardados) {
      this.alumnos = JSON.parse(alumnosGuardados).map((alumno: any) => ({
        ...alumno,
        fechaNacimiento: new Date(alumno.fechaNacimiento),
        cursos: alumno.cursos || []
      }));
    } else {
      this.alumnos = [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan@example.com',
          fechaNacimiento: new Date('1995-05-15'),
          cursos: []
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'González',
          email: 'maria@example.com',
          fechaNacimiento: new Date('2001-05-14'),
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
    return this.alumnos.find(alumno => alumno.id === id);
  }

  agregarAlumno(alumno: Omit<Alumno, 'id'>): void {
    const nuevoAlumno: Alumno = {
      ...alumno,
      id: this.generarNuevoId(),
      cursos: alumno.cursos || []
    };
    this.alumnos.push(nuevoAlumno);
    this.guardarAlumnos();
  }

  actualizarAlumno(id: number, alumno: Partial<Alumno>): void {
    const index = this.alumnos.findIndex(a => a.id === id);
    if (index !== -1) {
      this.alumnos[index] = { ...this.alumnos[index], ...alumno };
      this.guardarAlumnos();
    }
  }

  eliminarAlumno(id: number): void {
    this.alumnos = this.alumnos.filter(alumno => alumno.id !== id);
    this.guardarAlumnos();
  }

  private generarNuevoId(): number {
    return this.alumnos.length > 0 
      ? Math.max(...this.alumnos.map(a => a.id)) + 1 
      : 1;
  }
} 