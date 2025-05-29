import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatListModule, MatSidenavModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuItems = [
    { path: '/alumnos', label: 'Lista de Alumnos' },
    { path: '/cursos', label: 'Cursos' },
    { path: '/inscripciones', label: 'Inscripciones' },
    { path: '/notas', label: 'Gestión de Notas' }
  ];
} 