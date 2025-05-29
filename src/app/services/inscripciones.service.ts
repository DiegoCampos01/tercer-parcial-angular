import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, of } from 'rxjs';
import { Curso } from '../models/curso.model';
import { CursosService } from './cursos.service';
import { AlumnosService } from './alumnos.service';

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
  private inscripcionesSubject = new BehaviorSubject<Inscripcion[]>([]);

  constructor(
    private cursosService: CursosService,
    private alumnosService: AlumnosService
  ) {
    this.cargarInscripciones();
  }

  private cargarInscripciones(): void {
    const inscripcionesGuardadas = localStorage.getItem(this.STORAGE_KEY);
    if (inscripcionesGuardadas) {
      const inscripciones = JSON.parse(inscripcionesGuardadas);
      this.inscripcionesSubject.next(inscripciones.map((inscripcion: any) => ({
        ...inscripcion,
        fechaInscripcion: new Date(inscripcion.fechaInscripcion)
      })));
    }
  }

  private guardarInscripciones(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.inscripcionesSubject.value));
  }

  private generarNuevoId(): number {
    const inscripciones = this.inscripcionesSubject.value;
    return inscripciones.length > 0 ? Math.max(...inscripciones.map(i => i.id)) + 1 : 1;
  }

  getInscripciones(): Observable<Inscripcion[]> {
    return this.inscripcionesSubject.asObservable();
  }

  getInscripcionesPorAlumno(alumnoId: number): Observable<Inscripcion[]> {
    const inscripciones = this.inscripcionesSubject.value.filter(i => i.alumnoId === alumnoId);
    return of(inscripciones);
  }

  getInscripcionesPorCurso(cursoId: number): Observable<Inscripcion[]> {
    const inscripciones = this.inscripcionesSubject.value.filter(i => i.cursoId === cursoId);
    return of(inscripciones);
  }

  inscribirAlumno(cursoId: number, alumnoId: number): Observable<void> {
    const nuevaInscripcion: Inscripcion = {
      id: this.generarNuevoId(),
      cursoId,
      alumnoId,
      fechaInscripcion: new Date()
    };

    const inscripciones = [...this.inscripcionesSubject.value, nuevaInscripcion];
    this.inscripcionesSubject.next(inscripciones);
    this.guardarInscripciones();
    
    // Actualizar las relaciones en los otros servicios
    this.cursosService.agregarAlumno(cursoId, alumnoId);
    this.alumnosService.inscribirEnCurso(alumnoId, cursoId);

    return of(void 0);
  }

  desinscribirAlumno(cursoId: number, alumnoId: number): Observable<void> {
    const inscripciones = this.inscripcionesSubject.value.filter(
      i => !(i.cursoId === cursoId && i.alumnoId === alumnoId)
    );
    this.inscripcionesSubject.next(inscripciones);
    this.guardarInscripciones();

    // Actualizar las relaciones en los otros servicios
    this.cursosService.removerAlumno(cursoId, alumnoId);
    this.alumnosService.desinscribirDeCurso(alumnoId, cursoId);

    return of(void 0);
  }

  estaInscrito(cursoId: number, alumnoId: number): Observable<boolean> {
    const inscrito = this.inscripcionesSubject.value.some(
      i => i.cursoId === cursoId && i.alumnoId === alumnoId
    );
    return of(inscrito);
  }
} 