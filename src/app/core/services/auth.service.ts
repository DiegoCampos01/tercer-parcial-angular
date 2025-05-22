import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private readonly API_URL = environment.apiUrl;

  // Credenciales de prueba
  private readonly TEST_USERS = {
    admin: {
      username: 'admin',
      password: 'admin123',
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@academia.com',
        role: 'admin' as const
      }
    },
    user: {
      username: 'user',
      password: 'user123',
      user: {
        id: 2,
        username: 'user',
        email: 'user@academia.com',
        role: 'user' as const
      }
    }
  };

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    // Simulación de autenticación mientras se configura la API
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

    // Si las credenciales no coinciden, devolver un error
    return throwError(() => new Error('Credenciales inválidas'));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
} 