import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Alumno } from '../../../models/alumno.model';
import { TituloGrandeDirective } from '../../../directives/titulo-grande.directive';
import { AlumnosService } from '../../../services/alumnos.service';

@Component({
  selector: 'app-abm-alumnos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    TituloGrandeDirective
  ],
  templateUrl: './abm-alumnos.component.html',
  styleUrls: ['./abm-alumnos.component.scss']
})
export class AbmAlumnosComponent implements OnInit {
  alumnoForm: FormGroup;
  isEdit = false;
  alumnoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private alumnosService: AlumnosService
  ) {
    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(18)]],
      calificacion: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.alumnoId = Number(id);
      const alumno = this.alumnosService.getAlumnoPorId(this.alumnoId);
      if (alumno) {
        this.alumnoForm.patchValue(alumno);
      }
    }
  }

  onSubmit() {
    if (this.alumnoForm.valid) {
      if (this.isEdit && this.alumnoId) {
        this.alumnosService.editarAlumno({
          id: this.alumnoId,
          ...this.alumnoForm.value
        });
      } else {
        this.alumnosService.agregarAlumno(this.alumnoForm.value);
      }
      this.router.navigate(['/alumnos']);
    }
  }
} 