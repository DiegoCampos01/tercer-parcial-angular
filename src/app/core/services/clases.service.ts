import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Clase } from '../../models/clase.model';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private clases: Clase[] = [];
  private clasesSubject = new BehaviorSubject<Clase[]>([]);
  private readonly STORAGE_KEY = 'clases_data';

  constructor() {
    this.cargarClases();
  }

  private cargarClases(): void {
    const clasesGuardadas = localStorage.getItem(this.STORAGE_KEY);
    if (clasesGuardadas) {
      this.clases = JSON.parse(clasesGuardadas).map((clase: any) => ({
        ...clase,
        fecha: new Date(clase.fecha)
      }));
    } else {
      this.clases = [
        {
          id: 1,
          cursoId: 1,
          titulo: 'Introducción al Álgebra',
          descripcion: 'Primera clase de introducción a conceptos básicos',
          fecha: new Date('2024-05-10T10:00:00'),
          duracion: 120,
          aula: 'A101'
        },
        {
          id: 2,
          cursoId: 2,
          titulo: 'HTML y CSS Básico',
          descripcion: 'Fundamentos de desarrollo web',
          fecha: new Date('2024-05-11T14:00:00'),
          duracion: 90,
          aula: 'Lab 201'
        }
      ];
    }
    this.guardarClases();
  }

  private guardarClases(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.clases));
    this.clasesSubject.next(this.clases);
  }

  getClases(): Observable<Clase[]> {
    return this.clasesSubject.asObservable();
  }

  getClaseById(id: number): Clase | undefined {
    return this.clases.find(clase => clase.id === id);
  }

  getClasesPorCurso(cursoId: number): Clase[] {
    return this.clases.filter(clase => clase.cursoId === cursoId);
  }

  agregarClase(clase: Omit<Clase, 'id'>): void {
    const nuevaClase: Clase = {
      ...clase,
      id: this.generarNuevoId()
    };
    this.clases.push(nuevaClase);
    this.guardarClases();
  }

  actualizarClase(id: number, clase: Partial<Clase>): void {
    const index = this.clases.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clases[index] = { ...this.clases[index], ...clase };
      this.guardarClases();
    }
  }

  eliminarClase(id: number): void {
    this.clases = this.clases.filter(clase => clase.id !== id);
    this.guardarClases();
  }

  private generarNuevoId(): number {
    return this.clases.length > 0 
      ? Math.max(...this.clases.map(c => c.id)) + 1 
      : 1;
  }
} 