import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  getUsuarioById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  crearUsuario(usuario: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.API_URL, usuario);
  }

  actualizarUsuario(id: number, usuario: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
} 