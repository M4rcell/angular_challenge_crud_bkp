import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComponent } from './add.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FinanceService } from 'src/app/services/finance.service';
import { Finance } from 'src/app/core/models/finance.model';

/* const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: (param: string) => 'valor-de-prueba',
    },
  },
}; */

const productFinance = {
  id: 'trj-crd001',
  name: 'Tarjeta de debito',
  description: 'Tarjeta de consumo',
  logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
  date_release: new Date(),
  date_revision: new Date(),
} as Finance;

const productFinanceEmpty = {
  id: null,
  name: null,
  description: null,
  logo: null,
  date_release: null,
  date_revision: null,
};

describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;
  //add
  let financeService: jasmine.SpyObj<FinanceService>;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    financeService = jasmine.createSpyObj('FinanceService', [
      'updateProductFinance',
      'getSharetProductFinance',
    ]);

    TestBed.configureTestingModule({
      declarations: [AddComponent],
      imports: [HttpClientModule, RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: FinanceService, useValue: financeService },
        /* {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (param: string) => '1' }), // Simulamos un valor de '1' para 'id'
          },
        },
        FormBuilder, */
      ],
    });
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //add
    //formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the form', () => {
    // Simula que se llenan algunos campos del formulario
    component.addForm.setValue(productFinance);
    // Llama a la función reset
    component.reset();
    // Comprueba que los campos del formulario están vacíos después del reset
    expect(component.addForm.value).toEqual(productFinanceEmpty);
  });

  // Metodo save
  /*
  it('should not create or update when the form is invalid', () => {
    const createdNewProductSpy = spyOn(component, 'createdNewProduct');
    const updateProductSpy = spyOn(component, 'updateProduct');

    // Marcar el formulario como inválido
    //component.addForm.get('id').setErrors({ required: true });

    // Llamar a la función save
    component.save();

    // Comprobar que las funciones de creación o actualización no se llaman
    expect(createdNewProductSpy).not.toHaveBeenCalled();
    expect(updateProductSpy).not.toHaveBeenCalled();
  });

  it('should call createdNewProduct when form is valid and productId is null', () => {
    const createdNewProductSpy = spyOn(component, 'createdNewProduct');
    const updateProductSpy = spyOn(component, 'updateProduct');

    // Establecer productId en null
    component.productId = null;

    // Llamar a la función save
    component.save();

    // Comprobar que createdNewProduct se llama y updateProduct no se llama
    expect(createdNewProductSpy).toHaveBeenCalled();
    expect(updateProductSpy).not.toHaveBeenCalled();
  });

  it('should call updateProduct when form is valid and productId is not null', () => {
    const createdNewProductSpy = spyOn(component, 'createdNewProduct');
    const updateProductSpy = spyOn(component, 'updateProduct');

    // Establecer un valor no nulo para productId
    component.productId = '1';

    // Llamar a la función save
    component.save();

    // Comprobar que updateProduct se llama y createdNewProduct no se llama
    expect(updateProductSpy).toHaveBeenCalled();
    expect(createdNewProductSpy).not.toHaveBeenCalled();
  });
*/
  /*
  it('should set productId on paramMap change', () => {
    // Verificamos que productId se actualice después de la suscripción al paramMap
    expect(component.productId).toBe('1');
  });

  //add
  it('should update product and reset form', () => {
    const formValue = productFinance;

    component.addForm.setValue(formValue);
    financeService.updateProductFinance.and.returnValue(of());

    component.updateProduct();

    expect(financeService.updateProductFinance).toHaveBeenCalledWith(formValue);
    expect(component.addForm.value).toEqual({}); // Comprueba que el formulario se haya reseteado
  });

  it('should handle error', () => {
    const errorMessage = 'Error updating product finance';
    financeService.updateProductFinance.and.returnValue(
      throwError(errorMessage)
    );

    spyOn(console, 'log');

    component.updateProduct();

    expect(console.log).toHaveBeenCalledWith(errorMessage);
  });

  afterEach(() => {
    component.ngOnDestroy(); // Limpia las suscripciones después de cada prueba
  }); */
});
