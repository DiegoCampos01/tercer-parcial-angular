import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Credenciales de prueba
  private readonly TEST_USERS = {
    admin: {
      username: 'admin@admin.com',
      password: 'admin123',
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@admin.com',
        role: 'admin' as const
      }
    },
    user: {
      username: 'usuario@usuario.com',
      password: 'user123',
      user: {
        id: 2,
        username: 'usuario',
        email: 'usuario@usuario.com',
        role: 'user' as const
      }
    }
  };

  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    // Simulación de autenticación
    const testUser = Object.values(this.TEST_USERS).find(
      u => u.username === username && u.password === password
    );

    if (testUser) {
      const response: LoginResponse = {
        user: testUser.user,
        token: 'test-token-' + Math.random()
      };
      return of(response).pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
    }

    return throwError(() => new Error('Credenciales inválidas'));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
} 