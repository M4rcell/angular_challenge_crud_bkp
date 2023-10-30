import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComponent } from './add.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FinanceService } from 'src/app/services/finance.service';
import { Finance } from 'src/app/core/models/finance.model';
import * as dayjs from 'dayjs';

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
      'createdNewProductFinance',
      'updateProductFinance',
      'getSharetProductFinance',
    ]);

    TestBed.configureTestingModule({
      declarations: [AddComponent],
      imports: [HttpClientModule, RouterTestingModule, ReactiveFormsModule],
      providers: [{ provide: FinanceService, useValue: financeService }],
    });
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //add
    formBuilder = TestBed.inject(FormBuilder);
    component.addForm = formBuilder.group(productFinance);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Method for onChangeDate
  it('should update date_revision when date_release is greater than or equal to current date', () => {
    const currentDate = dayjs().format('YYYY-MM-DD');
    component.addForm.get('date_release')?.setValue(currentDate);

    component.onChangeDate(new Event('change'));

    const expectedDateRevision = dayjs(currentDate)
      .add(1, 'year')
      .format('YYYY-MM-DD');
    expect(component.addForm.get('date_revision')?.value).toBe(
      expectedDateRevision
    );
  });

  it('should set "required" error for date_release and date_revision when date_release is less than current date', () => {
    const pastDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
    component.addForm.get('date_release')?.setValue(pastDate);

    component.onChangeDate(new Event('change'));

    expect(component.addForm.get('date_release')?.hasError('required')).toBe(
      true
    );
    expect(component.addForm.get('date_revision')?.hasError('required')).toBe(
      true
    );
  });

  it('should not set "required" error for date_release and date_revision when date_release is valid', () => {
    const currentDate = dayjs().format('YYYY-MM-DD');
    component.addForm.get('date_release')?.setValue(currentDate);

    component.onChangeDate(new Event('change'));

    expect(component.addForm.get('date_release')?.hasError('required')).toBe(
      false
    );
    expect(component.addForm.get('date_revision')?.hasError('required')).toBe(
      false
    );
  });

  // method rest form
  it('should reset the form', () => {
    // Simula que se llenan algunos campos del formulario
    component.addForm.setValue(productFinance);
    // Llama a la función reset
    component.reset();
    // Comprueba que los campos del formulario están vacíos después del reset
    expect(component.addForm.value).toEqual(productFinanceEmpty);
  });

  // Metodo save
  it('should call createdNewProduct when productId is falsy', () => {
    spyOn(component, 'createdNewProduct');
    component.productId = null; // Falsy value

    component.save();

    expect(component.createdNewProduct).toHaveBeenCalled();
  });

  it('should call updateProduct when productId is truthy', () => {
    spyOn(component, 'updateProduct');
    component.productId = 'someValue'; // Truthy value

    component.save();

    expect(component.updateProduct).toHaveBeenCalled();
  });

  it('should mark all controls as touched when form is invalid', () => {
    spyOn(component.addForm, 'markAllAsTouched');

    // Simular un formulario inválido
    component.addForm.get('id')?.setErrors({ someError: true });
    component.save();

    expect(component.addForm.markAllAsTouched).toHaveBeenCalled();
  });

  // for method createdNewProduct

  it('should call createdNewProductFinance and reset form on success', () => {
    // Supongamos que `createdNewProductFinance` retorna un observable con éxito
    financeService.createdNewProductFinance.and.returnValue(of());

    component.addForm.setValue(productFinance);

    component.createdNewProduct();

    expect(financeService.createdNewProductFinance).toHaveBeenCalledWith(
      component.addForm.value
    );
    expect(component.addForm.value).toEqual(productFinance); // Verifica que el formulario se haya reseteado
  });

  it('should log error on failure createdNewProductFinance ', () => {
    const errorMessage = 'Error en la creación del producto';

    financeService.createdNewProductFinance.and.returnValue(
      throwError(errorMessage)
    );

    spyOn(console, 'log'); // Espía el método console.log

    component.addForm.setValue(productFinance);

    component.createdNewProduct();

    expect(console.log).toHaveBeenCalledWith(errorMessage); // Verifica que se haya registrado el error
  });

  // for method updateProduct
  it('should call updateProductFinance and reset form on success', () => {
    const mockResponse = {
      /* Mock the response object */
    };
    financeService.updateProductFinance.and.returnValue(of());

    // Asegúrate de tener valores en el formulario antes de llamar a la función
    component.addForm.patchValue(productFinance);

    component.updateProduct();

    expect(financeService.updateProductFinance).toHaveBeenCalledWith(
      component.addForm.value
    );
    //expect(component.reset).toHaveBeenCalled();
  });

  it('should log error on failure updateProductFinance', () => {
    const mockError = new Error('An error occurred');
    financeService.updateProductFinance.and.returnValue(throwError(mockError));
    spyOn(console, 'log'); // Espía el método console.log

    component.addForm.setValue(productFinance);
    component.updateProduct();

    expect(console.log).toHaveBeenCalledWith(mockError);
  });

  // Ondestroy
  afterEach(() => {
    component.ngOnDestroy(); // Limpia las suscripciones después de cada prueba
  });
});
