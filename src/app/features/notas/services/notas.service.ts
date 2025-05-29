import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Nota {
  id: number;
  alumnoId: number;
  cursoId: number;
  calificacion: number;
  fecha: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  private readonly STORAGE_KEY = 'notas_data';
  private notas: Nota[] = [];
  private notasSubject = new BehaviorSubject<Nota[]>([]);

  constructor() {
    this.cargarNotas();
  }

  private cargarNotas(): void {
    const notasGuardadas = localStorage.getItem(this.STORAGE_KEY);
    if (notasGuardadas) {
      this.notas = JSON.parse(notasGuardadas).map((nota: any) => ({
        ...nota,
        fecha: new Date(nota.fecha)
      }));
    }
    this.notasSubject.next(this.notas);
  }

  private guardarNotas(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notas));
    this.notasSubject.next(this.notas);
  }

  getNotas(): Observable<Nota[]> {
    return this.notasSubject.asObservable();
  }

  getNotasPorAlumno(alumnoId: number): Nota[] {
    return this.notas.filter(nota => nota.alumnoId === alumnoId);
  }

  getNotaPorAlumnoYCurso(alumnoId: number, cursoId: number): Nota | undefined {
    return this.notas.find(nota => 
      nota.alumnoId === alumnoId && nota.cursoId === cursoId
    );
  }

  agregarNota(alumnoId: number, cursoId: number, calificacion: number): void {
    const notaExistente = this.getNotaPorAlumnoYCurso(alumnoId, cursoId);

    if (notaExistente) {
      // Actualizar nota existente
      notaExistente.calificacion = calificacion;
      notaExistente.fecha = new Date();
    } else {
      // Crear nueva nota
      const nuevoId = Math.max(...this.notas.map(n => n.id), 0) + 1;
      const nuevaNota: Nota = {
        id: nuevoId,
        alumnoId,
        cursoId,
        calificacion,
        fecha: new Date()
      };
      this.notas.push(nuevaNota);
    }

    this.guardarNotas();
  }

  eliminarNota(id: number): void {
    this.notas = this.notas.filter(nota => nota.id !== id);
    this.guardarNotas();
  }

  getEstadoNota(calificacion: number): string {
    return calificacion >= 3.0 ? 'APROBADO' : 'REPROBADO';
  }

  getColorNota(calificacion: number): string {
    return calificacion >= 3.0 ? 'success' : 'danger';
  }
} 