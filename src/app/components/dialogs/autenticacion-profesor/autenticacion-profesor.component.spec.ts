import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutenticacionProfesorComponent } from './autenticacion-profesor.component';

describe('AutenticacionProfesorComponent', () => {
  let component: AutenticacionProfesorComponent;
  let fixture: ComponentFixture<AutenticacionProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutenticacionProfesorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutenticacionProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
