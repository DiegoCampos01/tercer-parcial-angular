import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <div class="app-container" *ngIf="authService.isLoggedIn()">
      <nav class="sidebar">
        <div class="menu-title">Menú</div>
        <a routerLink="/alumnos" routerLinkActive="active">Alumnos</a>
        <a routerLink="/cursos" routerLinkActive="active">Cursos</a>
        <a routerLink="/inscripciones" routerLinkActive="active">Inscripciones</a>
        <a routerLink="/notas" routerLinkActive="active">Notas</a>
        <a routerLink="/usuarios" routerLinkActive="active" *ngIf="authService.isAdmin()">Usuarios</a>
        <a href="javascript:void(0)" (click)="logout()" class="logout-link">Cerrar Sesión</a>
      </nav>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
    <router-outlet *ngIf="!authService.isLoggedIn()"></router-outlet>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
    }
    .sidebar {
      width: 250px;
      background-color: #2c3e50;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
    .menu-title {
      color: white;
      font-size: 1.2em;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #34495e;
    }
    .sidebar a {
      color: #ecf0f1;
      text-decoration: none;
      padding: 10px;
      margin: 5px 0;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .sidebar a:hover {
      background-color: #34495e;
    }
    .sidebar a.active {
      background-color: #3498db;
    }
    .content {
      flex: 1;
      padding: 20px;
      background-color: #f5f5f5;
      overflow-y: auto;
    }
    .logout-link {
      margin-top: auto !important;
      background-color: #c0392b;
    }
    .logout-link:hover {
      background-color: #e74c3c !important;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
