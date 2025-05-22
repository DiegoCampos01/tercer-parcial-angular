import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Nota {
  id: number;
  alumnoId: number;
  cursoId: number;
  calificacion: number;
  fecha: Date;
  alumno?: {
    nombre: string;
    apellido: string;
  };
  curso?: {
    nombre: string;
  };
}

// Simulamos datos de alumnos y cursos
const ALUMNOS_DATA = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez' },
  { id: 2, nombre: 'María', apellido: 'González' },
  { id: 3, nombre: 'Pedro', apellido: 'López' },
  { id: 4, nombre: 'Ana', apellido: 'Martínez' },
];

const CURSOS_DATA = [
  { id: 1, nombre: 'Matemáticas' },
  { id: 2, nombre: 'Historia' },
  { id: 3, nombre: 'Ciencias' },
];

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  private notas: Nota[] = [
    { id: 1, alumnoId: 1, cursoId: 1, calificacion: 8.5, fecha: new Date('2023-01-15') },
    { id: 2, alumnoId: 2, cursoId: 1, calificacion: 9.0, fecha: new Date('2023-01-15') },
    { id: 3, alumnoId: 3, cursoId: 2, calificacion: 7.0, fecha: new Date('2023-01-20') },
    { id: 4, alumnoId: 4, cursoId: 3, calificacion: 6.5, fecha: new Date('2023-01-22') },
    { id: 5, alumnoId: 1, cursoId: 2, calificacion: 7.8, fecha: new Date('2023-01-25') },
  ];
  private notasSubject = new BehaviorSubject<Nota[]>(this.notas);
  private readonly STORAGE_KEY = 'notas_data';

  constructor() {
    this.cargarNotas(); // Cargar notas desde localStorage si existen
  }

  private cargarNotas(): void {
    const notasGuardadas = localStorage.getItem(this.STORAGE_KEY);
    if (notasGuardadas) {
      this.notas = JSON.parse(notasGuardadas).map((nota: any) => ({
        ...nota,
        fecha: new Date(nota.fecha)
      }));
    }
    // No sobrescribimos las notas iniciales con localStorage vacío
    this.notasSubject.next(this.notas);
  }

  private guardarNotas(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notas));
    this.notasSubject.next(this.notas);
  }

  // Modificado para incluir información de alumno y curso
  getNotas(cursoId?: number | null): Observable<Nota[]> {
    let notasFiltradas = this.notas;
    if (cursoId !== null && cursoId !== undefined) {
      notasFiltradas = this.notas.filter(nota => nota.cursoId === cursoId);
    }

    const notasConDetalle = notasFiltradas.map(nota => {
      const alumno = ALUMNOS_DATA.find(a => a.id === nota.alumnoId);
      const curso = CURSOS_DATA.find(c => c.id === nota.cursoId);
      return {
        ...nota,
        alumno: alumno ? { nombre: alumno.nombre, apellido: alumno.apellido } : undefined,
        curso: curso ? { nombre: curso.nombre } : undefined
      };
    });

    return of(notasConDetalle); // Usamos `of` para devolver un Observable sincrónico
  }

  getNotaById(id: number): Observable<Nota | undefined> {
    const nota = this.notas.find(n => n.id === id);
    const alumno = ALUMNOS_DATA.find(a => a.id === nota?.alumnoId);
    const curso = CURSOS_DATA.find(c => c.id === nota?.cursoId);
    const notaConDetalle = nota ? {
      ...nota,
      alumno: alumno ? { nombre: alumno.nombre, apellido: alumno.apellido } : undefined,
      curso: curso ? { nombre: curso.nombre } : undefined
    } : undefined;
    return of(notaConDetalle);
  }

  crearNota(nota: Omit<Nota, 'id'>): Observable<Nota> {
    const nuevaNota: Nota = {
      ...nota,
      id: this.generarNuevoId(),
      fecha: new Date()
    };
    this.notas.push(nuevaNota);
    this.guardarNotas();
    // Incluir alumno y curso en la respuesta simulada
    const alumno = ALUMNOS_DATA.find(a => a.id === nuevaNota.alumnoId);
    const curso = CURSOS_DATA.find(c => c.id === nuevaNota.cursoId);
    const notaConDetalle = {
      ...nuevaNota,
      alumno: alumno ? { nombre: alumno.nombre, apellido: alumno.apellido } : undefined,
      curso: curso ? { nombre: curso.nombre } : undefined
    };
    return of(notaConDetalle);
  }

  actualizarNota(id: number, cambios: Partial<Nota>): Observable<Nota | undefined> {
    const index = this.notas.findIndex(n => n.id === id);
    if (index > -1) {
      this.notas[index] = { ...this.notas[index], ...cambios };
      this.guardarNotas();
      // Incluir alumno y curso en la respuesta simulada
      const notaActualizada = this.notas[index];
      const alumno = ALUMNOS_DATA.find(a => a.id === notaActualizada.alumnoId);
      const curso = CURSOS_DATA.find(c => c.id === notaActualizada.cursoId);
      const notaConDetalle = {
        ...notaActualizada,
        alumno: alumno ? { nombre: alumno.nombre, apellido: alumno.apellido } : undefined,
        curso: curso ? { nombre: curso.nombre } : undefined
      };
      return of(notaConDetalle);
    }
    return of(undefined);
  }

  eliminarNota(id: number): Observable<void> {
    const notasAntes = this.notas.length;
    this.notas = this.notas.filter(n => n.id !== id);
    if (this.notas.length < notasAntes) {
      this.guardarNotas();
      return of(undefined); // Simula eliminación exitosa
    }
    return of(undefined); // Simula que no se encontró la nota (o podrías simular un error)
  }

  private generarNuevoId(): number {
    return Math.max(...this.notas.map(n => n.id), 0) + 1;
  }
} 