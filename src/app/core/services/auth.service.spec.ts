import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginResponse } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockResponse: LoginResponse = {
      user: {
        id: 1,
        username: 'test',
        email: 'test@example.com',
        role: 'admin' as const
      },
      token: 'fake-token'
    };

    service.login('test', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockResponse.user));
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout successfully', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('currentUser', JSON.stringify({ id: 1, username: 'test' }));

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('should check if user is authenticated', () => {
    expect(service.isAuthenticated()).toBeFalse();

    localStorage.setItem('currentUser', JSON.stringify({ id: 1, username: 'test' }));
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should check if user is admin', () => {
    expect(service.isAdmin()).toBeFalse();

    localStorage.setItem('currentUser', JSON.stringify({ id: 1, username: 'test', role: 'admin' }));
    expect(service.isAdmin()).toBeTrue();

    localStorage.setItem('currentUser', JSON.stringify({ id: 1, username: 'test', role: 'user' }));
    expect(service.isAdmin()).toBeFalse();
  });

  it('should get token', () => {
    expect(service.getToken()).toBeNull();

    localStorage.setItem('token', 'fake-token');
    expect(service.getToken()).toBe('fake-token');
  });
}); 