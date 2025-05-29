import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Nota {
  alumnoId: number;
  cursoId: number;
  calificacion: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  private readonly STORAGE_KEY = 'notas';
  private notasSubject = new BehaviorSubject<Nota[]>([]);

  constructor() {
    this.cargarNotas();
  }

  private cargarNotas(): void {
    const notasGuardadas = localStorage.getItem(this.STORAGE_KEY);
    if (notasGuardadas) {
      const notas = JSON.parse(notasGuardadas);
      this.notasSubject.next(notas);
    } else {
      // Datos iniciales si no hay datos guardados
      const notasIniciales: Nota[] = [
        {
          alumnoId: 1,
          cursoId: 1,
          calificacion: 4.5
        },
        {
          alumnoId: 2,
          cursoId: 2,
          calificacion: 3.8
        }
      ];
      this.notasSubject.next(notasIniciales);
      this.guardarNotas();
    }
  }

  private guardarNotas(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notasSubject.value));
  }

  getNotas(): Observable<Nota[]> {
    return this.notasSubject.asObservable();
  }

  getNotasPorAlumno(alumnoId: number): Nota[] {
    return this.notasSubject.value.filter(nota => nota.alumnoId === alumnoId);
  }

  getNotasPorCurso(cursoId: number): Nota[] {
    return this.notasSubject.value.filter(nota => nota.cursoId === cursoId);
  }

  getNotaPorAlumnoYCurso(alumnoId: number, cursoId: number): Nota | undefined {
    return this.notasSubject.value.find(
      nota => nota.alumnoId === alumnoId && nota.cursoId === cursoId
    );
  }

  guardarNota(nota: Nota): void {
    const notas = this.notasSubject.value;
    const index = notas.findIndex(
      n => n.alumnoId === nota.alumnoId && n.cursoId === nota.cursoId
    );
    
    if (index !== -1) {
      // Actualizar nota existente
      notas[index] = nota;
    } else {
      // Agregar nueva nota
      notas.push(nota);
    }
    
    this.notasSubject.next(notas);
    this.guardarNotas();
  }

  eliminarNota(alumnoId: number, cursoId: number): void {
    const notas = this.notasSubject.value.filter(
      nota => !(nota.alumnoId === alumnoId && nota.cursoId === cursoId)
    );
    this.notasSubject.next(notas);
    this.guardarNotas();
  }
} 