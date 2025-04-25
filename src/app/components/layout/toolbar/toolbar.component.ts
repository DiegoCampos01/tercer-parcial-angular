import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TituloGrandeDirective } from '../../../directives/titulo-grande.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatToolbarModule, 
    TituloGrandeDirective, 
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span appTituloGrande>{{ title }}</span>
      <span class="spacer"></span>
      <button mat-icon-button (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class ToolbarComponent {
  title = 'Gestión de Alumnos';

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
} 