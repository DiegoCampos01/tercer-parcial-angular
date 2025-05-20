import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Clase } from '../models/clase.model';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private clases: Clase[] = [];
  private clasesSubject = new BehaviorSubject<Clase[]>([]);

  constructor() {
    // Datos de ejemplo
    this.clases = [
      {
        id: 1,
        cursoId: 1,
        titulo: 'Introducción a las Matemáticas',
        descripcion: 'Conceptos básicos de matemáticas',
        fecha: new Date('2024-03-20T10:00:00'),
        duracion: 60,
        aula: 'A101'
      },
      {
        id: 2,
        cursoId: 2,
        titulo: 'Introducción a Angular',
        descripcion: 'Primeros pasos con Angular',
        fecha: new Date('2024-03-21T14:00:00'),
        duracion: 90,
        aula: 'B203'
      }
    ];
    this.clasesSubject.next(this.clases);
  }

  getClases(): Observable<Clase[]> {
    return this.clasesSubject.asObservable();
  }

  getClasesPorCurso(cursoId: number): Observable<Clase[]> {
    return new Observable(observer => {
      const clases = this.clases.filter(c => c.cursoId === cursoId);
      observer.next(clases);
      observer.complete();
    });
  }

  getClaseById(id: number): Clase | undefined {
    return this.clases.find(c => c.id === id);
  }

  agregarClase(clase: Omit<Clase, 'id'>): void {
    const nuevoId = Math.max(...this.clases.map(c => c.id), 0) + 1;
    const nuevaClase = { ...clase, id: nuevoId };
    this.clases.push(nuevaClase);
    this.clasesSubject.next(this.clases);
  }

  actualizarClase(id: number, clase: Partial<Clase>): void {
    const index = this.clases.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clases[index] = { ...this.clases[index], ...clase };
      this.clasesSubject.next(this.clases);
    }
  }

  eliminarClase(id: number): void {
    this.clases = this.clases.filter(c => c.id !== id);
    this.clasesSubject.next(this.clases);
  }
} 