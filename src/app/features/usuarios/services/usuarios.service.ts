import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { User } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly STORAGE_KEY = 'usuarios';
  private usuariosSubject = new BehaviorSubject<User[]>([]);

  constructor() {
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
    const usuariosGuardados = localStorage.getItem(this.STORAGE_KEY);
    if (usuariosGuardados) {
      this.usuariosSubject.next(JSON.parse(usuariosGuardados));
    } else {
      // Inicializar con un usuario admin por defecto si no hay usuarios
      const adminDefault: User = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
      };
      this.usuariosSubject.next([adminDefault]);
      this.guardarUsuarios();
    }
  }

  private guardarUsuarios(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.usuariosSubject.value));
  }

  private generarNuevoId(): number {
    const usuarios = this.usuariosSubject.value;
    return usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
  }

  getUsuarios(): Observable<User[]> {
    return this.usuariosSubject.asObservable();
  }

  getUsuarioById(id: number): Observable<User> {
    const usuario = this.usuariosSubject.value.find(u => u.id === id);
    return usuario ? of(usuario) : throwError(() => new Error('Usuario no encontrado'));
  }

  crearUsuario(usuario: Omit<User, 'id'>): Observable<User> {
    const nuevoUsuario: User = {
      ...usuario,
      id: this.generarNuevoId()
    };
    const usuarios = [...this.usuariosSubject.value, nuevoUsuario];
    this.usuariosSubject.next(usuarios);
    this.guardarUsuarios();
    return of(nuevoUsuario);
  }

  actualizarUsuario(id: number, usuario: Partial<User>): Observable<User> {
    const usuarios = this.usuariosSubject.value;
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Usuario no encontrado'));
    }

    const usuarioActualizado: User = {
      ...usuarios[index],
      ...usuario,
      id
    };
    usuarios[index] = usuarioActualizado;
    this.usuariosSubject.next(usuarios);
    this.guardarUsuarios();
    return of(usuarioActualizado);
  }

  eliminarUsuario(id: number): Observable<void> {
    const usuarios = this.usuariosSubject.value;
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Usuario no encontrado'));
    }

    usuarios.splice(index, 1);
    this.usuariosSubject.next(usuarios);
    this.guardarUsuarios();
    return of(void 0);
  }
} 