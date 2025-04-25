import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/layout/navbar/navbar.component';
import { ToolbarComponent } from './components/layout/toolbar/toolbar.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToolbarComponent, CommonModule],
  template: `
    <ng-container *ngIf="!isLoginPage">
      <app-toolbar></app-toolbar>
      <app-navbar>
        <router-outlet></router-outlet>
      </app-navbar>
    </ng-container>
    <ng-container *ngIf="isLoginPage">
      <router-outlet></router-outlet>
    </ng-container>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url === '/login';
    });
  }
}
