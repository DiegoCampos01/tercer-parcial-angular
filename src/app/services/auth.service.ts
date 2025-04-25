import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private isLoggedIn = false;

  // Usuario de prueba
  private mockUser: User = {
    email: 'profesor@universidad.com',
    password: '123456',
    role: 'profesor'
  };

  constructor(
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): boolean {
    // Validación con usuario de prueba
    if (email === this.mockUser.email && password === this.mockUser.password) {
      const user: User = {
        email,
        password,
        role: 'profesor'
      };
      
      this.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
} 