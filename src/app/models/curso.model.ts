export interface Curso {
    id: number;
    nombre: string;
    descripcion: string;
    profesor: string;
    duracion: number; // en horas
    alumnos: number[]; // IDs de los alumnos inscritos
} 