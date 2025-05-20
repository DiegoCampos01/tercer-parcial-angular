import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { CursosService } from '../../../services/cursos.service';
import { Curso } from '../../../models/curso.model';

@Component({
  selector: 'app-abm-cursos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './abm-cursos.component.html',
  styleUrls: ['./abm-cursos.component.scss']
})
export class AbmCursosComponent implements OnInit {
  cursoForm: FormGroup;
  esEdicion = false;
  cursoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private cursosService: CursosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      profesor: ['', [Validators.required, Validators.minLength(3)]],
      duracion: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.cursoId = +id;
      const curso = this.cursosService.getCursoById(this.cursoId);
      if (curso) {
        this.cursoForm.patchValue(curso);
      }
    }
  }

  onSubmit(): void {
    if (this.cursoForm.valid) {
      const cursoData = this.cursoForm.value;
      
      if (this.esEdicion && this.cursoId) {
        const cursoActualizado: Curso = {
          ...cursoData,
          id: this.cursoId,
          alumnos: this.cursosService.getCursoById(this.cursoId)?.alumnos || []
        };
        this.cursosService.actualizarCurso(cursoActualizado);
      } else {
        this.cursosService.agregarCurso(cursoData);
      }
      
      this.router.navigate(['/cursos']);
    }
  }

  cancelar(): void {
    this.router.navigate(['/cursos']);
  }
} 