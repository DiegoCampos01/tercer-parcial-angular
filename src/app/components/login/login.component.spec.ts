import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { returnUrl: '/dashboard' }
            }
          }
        }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should require username and password', () => {
    expect(component.loginForm.valid).toBeFalsy();
    expect(component.loginForm.get('username')?.errors?.['required']).toBeTruthy();
    expect(component.loginForm.get('password')?.errors?.['required']).toBeTruthy();
  });

  it('should be valid when username and password are provided', () => {
    component.loginForm.patchValue({
      username: 'test',
      password: 'password'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call login service and navigate on successful login', () => {
    const mockResponse = {
      user: {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        role: 'admin' as const
      },
      token: 'fake-token'
    };

    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'test',
      password: 'password'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('test', 'password');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should show error message on failed login', () => {
    authService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.loginForm.patchValue({
      username: 'test',
      password: 'wrong'
    });

    component.onSubmit();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Usuario o contraseña incorrectos',
      'Cerrar',
      { duration: 3000 }
    );
  });
}); 