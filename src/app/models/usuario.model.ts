export type RolUsuario = 'admin' | 'usuario';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: RolUsuario;
  activo: boolean;
} 