import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComponent } from './add.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

/* const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: (param: string) => 'valor-de-prueba',
    },
  },
}; */

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddComponent],
      imports: [HttpClientModule, RouterTestingModule, ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (param: string) => '1' }), // Simulamos un valor de '1' para 'id'
          },
        },
      ],
    });
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set productId on paramMap change', () => {
    // Verificamos que productId se actualice después de la suscripción al paramMap
    expect(component.productId).toBe('1');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
