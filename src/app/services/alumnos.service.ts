import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alumno } from '../models/alumno.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
  private alumnos: Alumno[] = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@email.com', edad: 20, calificacion: 4.5 },
    { id: 2, nombre: 'María', apellido: 'Gómez', email: 'maria@email.com', edad: 22, calificacion: 2.8 },
    { id: 3, nombre: 'Carlos', apellido: 'López', email: 'carlos@email.com', edad: 21, calificacion: 3.2 }
  ];

  private alumnosSubject = new BehaviorSubject<Alumno[]>(this.alumnos);

  getAlumnos(): Observable<Alumno[]> {
    return this.alumnosSubject.asObservable();
  }

  agregarAlumno(alumno: Omit<Alumno, 'id'>): void {
    const nuevoId = this.alumnos.length > 0 ? Math.max(...this.alumnos.map(a => a.id)) + 1 : 1;
    const nuevoAlumno = { ...alumno, id: nuevoId };
    this.alumnos = [...this.alumnos, nuevoAlumno];
    this.alumnosSubject.next(this.alumnos);
  }

  editarAlumno(alumno: Alumno): void {
    this.alumnos = this.alumnos.map(a => a.id === alumno.id ? alumno : a);
    this.alumnosSubject.next(this.alumnos);
  }

  eliminarAlumno(id: number): void {
    this.alumnos = this.alumnos.filter(a => a.id !== id);
    this.alumnosSubject.next(this.alumnos);
  }

  getAlumnoPorId(id: number): Alumno | undefined {
    return this.alumnos.find(a => a.id === Number(id));
  }
} 