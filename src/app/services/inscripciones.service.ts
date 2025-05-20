import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Curso } from '../models/curso.model';
import { CursosService } from './cursos.service';

export interface Inscripcion {
  id: number;
  cursoId: number;
  alumnoId: number;
  fechaInscripcion: Date;
}

@Injectable({
  providedIn: 'root'
})
export class InscripcionesService {
  private readonly STORAGE_KEY = 'inscripciones';
  private inscripciones: Inscripcion[] = [];
  private inscripcionesSubject = new BehaviorSubject<Inscripcion[]>([]);

  constructor(private cursosService: CursosService) {
    this.cargarInscripciones();
  }

  private cargarInscripciones(): void {
    const inscripcionesGuardadas = localStorage.getItem(this.STORAGE_KEY);
    if (inscripcionesGuardadas) {
      this.inscripciones = JSON.parse(inscripcionesGuardadas).map((inscripcion: any) => ({
        ...inscripcion,
        fechaInscripcion: new Date(inscripcion.fechaInscripcion)
      }));
    } else {
      // Datos de ejemplo
      this.inscripciones = [
        {
          id: 1,
          cursoId: 1,
          alumnoId: 1,
          fechaInscripcion: new Date()
        }
      ];
    }
    this.inscripcionesSubject.next(this.inscripciones);
  }

  private guardarInscripciones(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.inscripciones));
    this.inscripcionesSubject.next(this.inscripciones);
  }

  getInscripciones(): Observable<Inscripcion[]> {
    return this.inscripcionesSubject.asObservable();
  }

  getInscripcionesPorAlumno(alumnoId: number): Observable<Inscripcion[]> {
    return new Observable(observer => {
      const inscripciones = this.inscripciones.filter(i => i.alumnoId === alumnoId);
      observer.next(inscripciones);
      observer.complete();
    });
  }

  getInscripcionesPorCurso(cursoId: number): Observable<Inscripcion[]> {
    return new Observable(observer => {
      const inscripciones = this.inscripciones.filter(i => i.cursoId === cursoId);
      observer.next(inscripciones);
      observer.complete();
    });
  }

  inscribirAlumno(cursoId: number, alumnoId: number): void {
    const nuevoId = Math.max(...this.inscripciones.map(i => i.id), 0) + 1;
    const nuevaInscripcion: Inscripcion = {
      id: nuevoId,
      cursoId,
      alumnoId,
      fechaInscripcion: new Date()
    };

    this.inscripciones.push(nuevaInscripcion);
    this.guardarInscripciones();
    
    // Actualizar el curso con el nuevo alumno
    this.cursosService.inscribirAlumno(cursoId, alumnoId);
  }

  desinscribirAlumno(cursoId: number, alumnoId: number): void {
    this.inscripciones = this.inscripciones.filter(
      i => !(i.cursoId === cursoId && i.alumnoId === alumnoId)
    );
    this.guardarInscripciones();
    
    // Actualizar el curso
    this.cursosService.desinscribirAlumno(cursoId, alumnoId);
  }

  estaInscrito(cursoId: number, alumnoId: number): boolean {
    return this.inscripciones.some(
      i => i.cursoId === cursoId && i.alumnoId === alumnoId
    );
  }
} 