import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlumnosService } from '../../../services/alumnos.service';
import { Alumno } from '../../../models/alumno.model';

@Component({
  selector: 'app-abm-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './abm-alumnos.component.html',
  styleUrls: ['./abm-alumnos.component.scss']
})
export class AbmAlumnosComponent implements OnInit {
  alumnoForm: FormGroup;
  esEdicion = false;
  alumnoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private alumnosService: AlumnosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.alumnoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.alumnoId = +id;
      const alumno = this.alumnosService.getAlumnoById(this.alumnoId);
      if (alumno) {
        this.alumnoForm.patchValue(alumno);
      }
    }
  }

  onSubmit(): void {
    if (this.alumnoForm.valid) {
      const alumnoData = this.alumnoForm.value;
      
      if (this.esEdicion && this.alumnoId) {
        const alumnoActualizado: Alumno = {
          ...alumnoData,
          id: this.alumnoId,
          cursos: this.alumnosService.getAlumnoById(this.alumnoId)?.cursos || []
        };
        this.alumnosService.actualizarAlumno(alumnoActualizado);
      } else {
        this.alumnosService.agregarAlumno(alumnoData);
      }
      
      this.router.navigate(['/alumnos']);
    }
  }

  cancelar(): void {
    this.router.navigate(['/alumnos']);
  }
} 