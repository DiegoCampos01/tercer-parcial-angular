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
import { Subscription, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface CursoConEstado extends Curso {
  inscrito: boolean;
  cuposDisponibles: number;
}

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
  cursosDisponibles: CursoConEstado[] = [];
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
    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.alumnoId = params['id'] ? +params['id'] : null;
        if (this.alumnoId) {
          this.cargarDatosAlumno();
        } else {
          this.cargarCursosDisponibles();
        }
      })
    );
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

  cargarCursosDisponibles(): void {
    this.subscriptions.push(
      this.cursosService.getCursos().pipe(
        switchMap(cursos => {
          if (!this.alumnoId) {
            // Si no hay alumno seleccionado, mostrar todos los cursos con sus cupos
            return of(cursos.map(curso => ({
              ...curso,
              inscrito: false,
              cuposDisponibles: curso.cupo - (curso.alumnos?.length || 0)
            })));
          }
          // Si hay alumno seleccionado, verificar inscripciones
          return forkJoin(
            cursos.map(curso =>
              this.inscripcionesService.estaInscrito(curso.id, this.alumnoId!).pipe(
                map(inscrito => ({
                  ...curso,
                  inscrito,
                  cuposDisponibles: curso.cupo - (curso.alumnos?.length || 0)
                }))
              )
            )
          );
        })
      ).subscribe(cursosConEstado => {
        this.cursosDisponibles = cursosConEstado;
      })
    );
  }

  inscribirse(curso: CursoConEstado): void {
    if (this.alumnoId && curso.cuposDisponibles > 0 && !curso.inscrito) {
      this.inscripcionesService.inscribirAlumno(curso.id, this.alumnoId).subscribe(() => {
        this.cargarCursosDisponibles();
      });
    }
  }

  desinscribirse(curso: CursoConEstado): void {
    if (this.alumnoId && curso.inscrito) {
      this.inscripcionesService.desinscribirAlumno(curso.id, this.alumnoId).subscribe(() => {
        this.cargarCursosDisponibles();
      });
    }
  }

  volver(): void {
    this.router.navigate(['/alumnos']);
  }
}
