export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: Date;
  cursos: number[]; // IDs de los cursos en los que está inscrito
} 