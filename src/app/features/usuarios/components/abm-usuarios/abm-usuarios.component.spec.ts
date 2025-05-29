import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { AbmUsuariosComponent } from './abm-usuarios.component';
import { UsuariosService } from '../../services/usuarios.service';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

describe('AbmUsuariosComponent', () => {
  let component: AbmUsuariosComponent;
  let fixture: ComponentFixture<AbmUsuariosComponent>;
  let usuariosService: jasmine.SpyObj<UsuariosService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockUsuario: User = {
    id: 1,
    username: 'test',
    email: 'test@example.com',
    role: 'admin' as const
  };

  beforeEach(async () => {
    const usuariosServiceSpy = jasmine.createSpyObj('UsuariosService', ['getUsuarioById', 'crearUsuario', 'actualizarUsuario']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AbmUsuariosComponent],
      providers: [
        { provide: UsuariosService, useValue: usuariosServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (param: string) => param === 'id' ? '1' : null
              }
            }
          }
        }
      ]
    }).compileComponents();

    usuariosService = TestBed.inject(UsuariosService) as jasmine.SpyObj<UsuariosService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmUsuariosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in edit mode when id is provided', () => {
    usuariosService.getUsuarioById.and.returnValue(of(mockUsuario));

    fixture.detectChanges();

    expect(component.esEdicion).toBeTrue();
    expect(component.usuarioId).toBe(1);
    expect(component.usuarioForm.get('username')?.value).toBe(mockUsuario.username);
    expect(component.usuarioForm.get('email')?.value).toBe(mockUsuario.email);
    expect(component.usuarioForm.get('role')?.value).toBe(mockUsuario.role);
  });

  it('should initialize form in create mode when no id is provided', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.paramMap, 'get').and.returnValue(null);

    fixture.detectChanges();

    expect(component.esEdicion).toBeFalse();
    expect(component.usuarioId).toBeNull();
    expect(component.usuarioForm.get('username')?.value).toBe('');
    expect(component.usuarioForm.get('email')?.value).toBe('');
    expect(component.usuarioForm.get('role')?.value).toBe('user');
  });

  it('should show error message when loading usuario fails', () => {
    usuariosService.getUsuarioById.and.returnValue(throwError(() => new Error('Failed to load')));

    fixture.detectChanges();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Error al cargar usuario',
      'Cerrar',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['/usuarios']);
  });

  it('should create new usuario when form is valid', () => {
    const newUsuario = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password',
      role: 'user' as const
    };

    usuariosService.crearUsuario.and.returnValue(of({ ...newUsuario, id: 2 }));

    component.usuarioForm.patchValue(newUsuario);
    component.onSubmit();

    expect(usuariosService.crearUsuario).toHaveBeenCalledWith(newUsuario);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Usuario creado correctamente',
      'Cerrar',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['/usuarios']);
  });

  it('should update existing usuario when form is valid', () => {
    usuariosService.getUsuarioById.and.returnValue(of(mockUsuario));
    usuariosService.actualizarUsuario.and.returnValue(of(mockUsuario));

    fixture.detectChanges();

    const updatedUsuario = {
      username: 'updated',
      email: 'updated@example.com',
      role: 'user' as const
    };

    component.usuarioForm.patchValue(updatedUsuario);
    component.onSubmit();

    expect(usuariosService.actualizarUsuario).toHaveBeenCalledWith(1, updatedUsuario);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Usuario actualizado correctamente',
      'Cerrar',
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(['/usuarios']);
  });

  it('should show error message when creating usuario fails', () => {
    usuariosService.crearUsuario.and.returnValue(throwError(() => new Error('Failed to create')));

    component.usuarioForm.patchValue({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password',
      role: 'user'
    });

    component.onSubmit();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Error al crear usuario',
      'Cerrar',
      { duration: 3000 }
    );
  });

  it('should show error message when updating usuario fails', () => {
    usuariosService.getUsuarioById.and.returnValue(of(mockUsuario));
    usuariosService.actualizarUsuario.and.returnValue(throwError(() => new Error('Failed to update')));

    fixture.detectChanges();

    component.usuarioForm.patchValue({
      username: 'updated',
      email: 'updated@example.com',
      role: 'user'
    });

    component.onSubmit();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Error al actualizar usuario',
      'Cerrar',
      { duration: 3000 }
    );
  });

  it('should navigate back to usuarios list', () => {
    component.volver();
    expect(router.navigate).toHaveBeenCalledWith(['/usuarios']);
  });
}); 