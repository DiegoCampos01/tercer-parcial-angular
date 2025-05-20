import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.interface';
import { NavMenuComponent } from '../../components/layout/nav-menu/nav-menu.component';

interface Materia {
  id: number;
  nombre: string;
  profesor: string;
  horario: string;
  aula: string;
}

interface Evaluacion {
  id: number;
  materia: string;
  fecha: string;
  tipo: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, NavMenuComponent]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  materias: Materia[] = [
    { id: 1, nombre: 'Matemáticas Avanzadas', profesor: 'Dr. García', horario: 'Lunes y Miércoles 8:00-10:00', aula: 'A-101' },
    { id: 2, nombre: 'Física Cuántica', profesor: 'Dra. Rodríguez', horario: 'Martes y Jueves 10:00-12:00', aula: 'B-203' },
    { id: 3, nombre: 'Programación Web', profesor: 'Ing. Martínez', horario: 'Viernes 14:00-18:00', aula: 'Lab-01' }
  ];

  evaluaciones: Evaluacion[] = [
    { id: 1, materia: 'Matemáticas Avanzadas', fecha: '2024-03-15', tipo: 'Parcial' },
    { id: 2, materia: 'Física Cuántica', fecha: '2024-03-20', tipo: 'Proyecto' },
    { id: 3, materia: 'Programación Web', fecha: '2024-03-25', tipo: 'Examen Final' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
  }

  logout() {
    this.authService.logout();
  }
} 