import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoAlumnoDialogComponent } from './nuevo-alumno-dialog.component';

describe('NuevoAlumnoDialogComponent', () => {
  let component: NuevoAlumnoDialogComponent;
  let fixture: ComponentFixture<NuevoAlumnoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoAlumnoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoAlumnoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
