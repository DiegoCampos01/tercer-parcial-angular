import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClasesService } from '../../../services/clases.service';
import { CursosService } from '../../../services/cursos.service';
import { Clase } from '../../../models/clase.model';
import { Curso } from '../../../models/curso.model';

@Component({
  selector: 'app-abm-clases',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './abm-clases.component.html',
  styleUrls: ['./abm-clases.component.scss']
})
export class AbmClasesComponent implements OnInit {
  claseForm: FormGroup;
  esEdicion = false;
  claseId: number | null = null;
  cursos: Curso[] = [];

  constructor(
    private fb: FormBuilder,
    private clasesService: ClasesService,
    private cursosService: CursosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.claseForm = this.fb.group({
      cursoId: ['', Validators.required],
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fecha: ['', Validators.required],
      duracion: ['', [Validators.required, Validators.min(15)]],
      aula: ['', [Validators.required, Validators.pattern('^[A-Z][0-9]{3}$')]]
    });
  }

  ngOnInit(): void {
    this.cursosService.getCursos().subscribe(cursos => {
      this.cursos = cursos;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.claseId = +id;
      const clase = this.clasesService.getClaseById(this.claseId);
      if (clase) {
        this.claseForm.patchValue(clase);
      }
    }
  }

  onSubmit(): void {
    if (this.claseForm.valid) {
      const claseData = this.claseForm.value;
      
      if (this.esEdicion && this.claseId) {
        this.clasesService.actualizarClase(this.claseId, claseData);
      } else {
        this.clasesService.agregarClase(claseData);
      }
      
      this.router.navigate(['/clases']);
    }
  }

  cancelar(): void {
    this.router.navigate(['/clases']);
  }
} 