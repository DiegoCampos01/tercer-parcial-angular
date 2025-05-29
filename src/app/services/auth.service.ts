import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario, RolUsuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/usuarios';
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  usuarioActual$ = this.usuarioActualSubject.asObservable();

  // Usuarios de prueba
  private readonly TEST_USERS: Record<string, Usuario> = {
    admin: {
      id: 1,
      nombre: 'Administrador',
      email: 'admin@admin.com',
      password: 'admin123',
      rol: 'admin',
      activo: true
    },
    user: {
      id: 2,
      nombre: 'Usuario Regular',
      email: 'usuario@usuario.com',
      password: 'user123',
      rol: 'usuario',
      activo: true
    }
  };

  constructor(private http: HttpClient) {
    // Recuperar sesión si existe
    const usuarioGuardado = localStorage.getItem('usuario_actual');
    if (usuarioGuardado) {
      this.usuarioActualSubject.next(JSON.parse(usuarioGuardado));
    }
  }

  login(email: string, password: string): Observable<Usuario> {
    // Primero intentamos con los usuarios de prueba
    const testUser = Object.values(this.TEST_USERS).find(
      u => u.email === email && u.password === password
    );

    if (testUser) {
      localStorage.setItem('usuario_actual', JSON.stringify(testUser));
      this.usuarioActualSubject.next(testUser);
      return of(testUser);
    }

    // Si no es un usuario de prueba, intentamos con la API
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(usuarios => {
        const usuario = usuarios[0];
        if (usuario && usuario.password === password && usuario.activo) {
          localStorage.setItem('usuario_actual', JSON.stringify(usuario));
          this.usuarioActualSubject.next(usuario);
          return usuario;
        }
        throw new Error('Credenciales inválidas');
      })
    );
  }

  logout(): void {
    localStorage.removeItem('usuario_actual');
    this.usuarioActualSubject.next(null);
  }

  isAdmin(): boolean {
    const usuario = this.usuarioActualSubject.value;
    return usuario?.rol === 'admin' || false;
  }

  isLoggedIn(): boolean {
    return this.usuarioActualSubject.value !== null;
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }
} 