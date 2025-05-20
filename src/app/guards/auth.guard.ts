import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (!isAuthenticated && state.url !== '/login') {
      this.router.navigate(['/login']);
      return false;
    }

    if (isAuthenticated && state.url === '/login') {
      this.router.navigate(['/alumnos']);
      return false;
    }

    return true;
  }
} 