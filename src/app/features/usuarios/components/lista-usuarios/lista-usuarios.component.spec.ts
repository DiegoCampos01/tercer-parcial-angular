import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { ListaUsuariosComponent } from './lista-usuarios.component';
import { UsuariosService } from '../../services/usuarios.service';
import { User } from '../../../core/services/auth.service';

describe('ListaUsuariosComponent', () => {
  let component: ListaUsuariosComponent;
  let fixture: ComponentFixture<ListaUsuariosComponent>;
  let usuariosService: jasmine.SpyObj<UsuariosService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockUsuarios: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin' as const
    },
    {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      role: 'user' as const
    }
  ];

  beforeEach(async () => {
    const usuariosServiceSpy = jasmine.createSpyObj('UsuariosService', ['getUsuarios', 'eliminarUsuario']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ListaUsuariosComponent],
      providers: [
        { provide: UsuariosService, useValue: usuariosServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    usuariosService = TestBed.inject(UsuariosService) as jasmine.SpyObj<UsuariosService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaUsuariosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load usuarios on init', () => {
    usuariosService.getUsuarios.and.returnValue(of(mockUsuarios));

    fixture.detectChanges();

    expect(component.usuarios).toEqual(mockUsuarios);
    expect(usuariosService.getUsuarios).toHaveBeenCalled();
  });

  it('should show error message when loading usuarios fails', () => {
    usuariosService.getUsuarios.and.returnValue(throwError(() => new Error('Failed to load')));

    fixture.detectChanges();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Error al cargar usuarios',
      'Cerrar',
      { duration: 3000 }
    );
  });

  it('should delete usuario when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    usuariosService.eliminarUsuario.and.returnValue(of(void 0));
    usuariosService.getUsuarios.and.returnValue(of(mockUsuarios));

    fixture.detectChanges();
    component.eliminarUsuario(mockUsuarios[0]);

    expect(usuariosService.eliminarUsuario).toHaveBeenCalledWith(mockUsuarios[0].id);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Usuario eliminado correctamente',
      'Cerrar',
      { duration: 3000 }
    );
  });

  it('should not delete usuario when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    usuariosService.getUsuarios.and.returnValue(of(mockUsuarios));

    fixture.detectChanges();
    component.eliminarUsuario(mockUsuarios[0]);

    expect(usuariosService.eliminarUsuario).not.toHaveBeenCalled();
  });

  it('should show error message when deleting usuario fails', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    usuariosService.eliminarUsuario.and.returnValue(throwError(() => new Error('Failed to delete')));
    usuariosService.getUsuarios.and.returnValue(of(mockUsuarios));

    fixture.detectChanges();
    component.eliminarUsuario(mockUsuarios[0]);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Error al eliminar usuario',
      'Cerrar',
      { duration: 3000 }
    );
  });
}); 