import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/alumnos/lista" routerLinkActive="active">
        <mat-icon matListItemIcon>people</mat-icon>
        <span matListItemTitle>Alumnos</span>
      </a>
      <a mat-list-item routerLink="/cursos/lista" routerLinkActive="active">
        <mat-icon matListItemIcon>school</mat-icon>
        <span matListItemTitle>Cursos</span>
      </a>
      <a mat-list-item routerLink="/clases/lista" routerLinkActive="active">
        <mat-icon matListItemIcon>class</mat-icon>
        <span matListItemTitle>Clases</span>
      </a>
      <a mat-list-item routerLink="/inscripciones/lista" routerLinkActive="active">
        <mat-icon matListItemIcon>how_to_reg</mat-icon>
        <span matListItemTitle>Inscripciones</span>
      </a>
      <a mat-list-item routerLink="/notas/lista" routerLinkActive="active">
        <mat-icon matListItemIcon>grade</mat-icon>
        <span matListItemTitle>Notas</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    .active {
      background-color: rgba(0, 0, 0, 0.1);
    }
    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class NavMenuComponent { } 