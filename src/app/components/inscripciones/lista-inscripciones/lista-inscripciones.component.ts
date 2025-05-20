import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CursosService } from '../../../services/cursos.service';
import { InscripcionesService } from '../../../services/inscripciones.service';
import { AlumnosService } from '../../../services/alumnos.service';
import { Curso } from '../../../models/curso.model';
import { Alumno } from '../../../models/alumno.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-inscripciones',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './lista-inscripciones.component.html',
  styleUrls: ['./lista-inscripciones.component.scss']
})
export class ListaInscripcionesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['nombre', 'profesor', 'duracion', 'cuposDisponibles', 'acciones'];
  cursosDisponibles: any[] = [];
  alumnoId: number | null = null;
  alumno: Alumno | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cursosService: CursosService,
    private inscripcionesService: InscripcionesService,
    private alumnosService: AlumnosService
  ) { }

  ngOnInit(): void {
    const paramsSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.alumnoId = +params['id'];
        this.cargarDatosAlumno();
      } else {
        this.cargarListaGeneral();
      }
    });
    this.subscriptions.push(paramsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  cargarDatosAlumno(): void {
    if (this.alumnoId) {
      const alumno = this.alumnosService.getAlumnoById(this.alumnoId);
      if (alumno) {
        this.alumno = alumno;
        this.cargarCursosDisponibles();
      } else {
        this.router.navigate(['/alumnos']);
      }
    }
  }

  cargarListaGeneral(): void {
    this.cursosService.getCursos().subscribe(cursos => {
      this.cursosDisponibles = cursos.map(curso => ({
        ...curso,
        cuposDisponibles: 29 - (curso.alumnos?.length || 0)
      }));
    });
  }

  cargarCursosDisponibles(): void {
    this.cursosService.getCursos().subscribe(cursos => {
      this.cursosDisponibles = cursos.map(curso => ({
        ...curso,
        cuposDisponibles: 29 - (curso.alumnos?.length || 0),
        inscrito: this.inscripcionesService.estaInscrito(curso.id, this.alumnoId!)
      }));
    });
  }

  inscribirse(curso: any): void {
    if (this.alumnoId && curso.cuposDisponibles > 0 && !curso.inscrito) {
      this.inscripcionesService.inscribirAlumno(curso.id, this.alumnoId);
      this.cargarCursosDisponibles();
    }
  }

  desinscribirse(curso: any): void {
    if (this.alumnoId && curso.inscrito) {
      this.inscripcionesService.desinscribirAlumno(curso.id, this.alumnoId);
      this.cargarCursosDisponibles();
    }
  }

  volver(): void {
    this.router.navigate(['/alumnos']);
  }
}
