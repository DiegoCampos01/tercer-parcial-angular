import { Pipe, PipeTransform } from '@angular/core';
import { Alumno } from '../models/alumno.model';

@Pipe({
  name: 'nombreCompleto',
  standalone: true
})
export class NombreCompletoPipe implements PipeTransform {
  transform(alumno: Alumno): string {
    return `${alumno.nombre} ${alumno.apellido}`;
  }
} 