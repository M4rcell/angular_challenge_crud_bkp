import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FinanceService } from 'src/app/services/finance.service';
import { Finance } from 'src/app/core/models/finance.model';
import { of, throwError } from 'rxjs';

const productFinance = {
  id: 'trj-crd001',
  name: 'Tarjeta de debito',
  description: 'Tarjeta de consumo',
  logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
  date_release: new Date(),
  date_revision: new Date(),
} as Finance;

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  //add
  // let router: Router;
  let financeService: jasmine.SpyObj<FinanceService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    financeService = jasmine.createSpyObj('FinanceService', [
      'setSharetProductFinance',
      'deleteProductFinance',
      'getProductFinance',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      //add
      imports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: FinanceService, useValue: financeService },
        { provide: Router, useValue: router },
      ],
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //add
  it('should navigate to /agregar', () => {
    component.addNewProduct();
    expect(router.navigate).toHaveBeenCalledWith(['/agregar']);
  });

  it('should set sharet product finance and navigate to /editar/{id}', () => {
    const id = productFinance.id;
    component.editar(productFinance);
    expect(financeService.setSharetProductFinance).toHaveBeenCalledWith(
      productFinance
    );
    expect(router.navigate).toHaveBeenCalledWith(['/editar', id]);
  });

  it('should call financeService.deleteProductFinance and handle success', () => {
    const financeData = productFinance;

    financeService.deleteProductFinance.and.returnValue(of(null)); // Simula un observable de éxito

    //spyOn(component, 'getAllProductFinance');

    component.eliminar(financeData);

    expect(financeService.deleteProductFinance).toHaveBeenCalledWith(
      financeData.id
    );
    // expect(component.getAllProductFinance).toHaveBeenCalled();
  });

  it('should call financeService.deleteProductFinance and handle error', () => {
    const financeData = { id: 1 } as any;
    const errorMessage = 'Error deleting product finance';

    financeService.deleteProductFinance.and.returnValue(
      throwError(errorMessage)
    ); // Simula un observable de error

    spyOn(console, 'log');

    component.eliminar(financeData);

    expect(financeService.deleteProductFinance).toHaveBeenCalledWith(
      financeData.id
    );
    expect(console.log).toHaveBeenCalledWith(errorMessage);
  });

  afterEach(() => {
    component.ngOnDestroy(); // Limpia las suscripciones después de cada prueba
  });

  it('should toggle context menu', () => {
    const event = new Event('contextmenu');
    const item = { id: 1, name: 'Item 1' };

    component.toggleContextMenu(event, item);

    expect(component.contextMenuOpen).toBe(true);
    expect(component.selectedItem).toBe(item);
    expect(component.contextMenuStyles).toBeDefined();
  });

  it('should close context menu', () => {
    component.contextMenuOpen = true;

    const event = new Event('contextmenu');
    const item = { id: 1, name: 'Item 1' };

    component.toggleContextMenu(event, item);

    expect(component.contextMenuOpen).toBe(false);
    expect(component.selectedItem).toBe(item);
    expect(component.contextMenuStyles).toBeDefined();
  });

  it('should call financeService.getProductFinance on success', () => {
    financeService.getProductFinance.and.returnValue(of());

    component.getAllProductFinance();

    expect(financeService.getProductFinance).toHaveBeenCalled();
  });
  /*
  it('should handle error', () => {
    const errorMessage = 'Error fetching product finance';

    financeService.getProductFinance.and.returnValue(throwError(errorMessage));
    spyOn(console, 'log');

    component.getAllProductFinance();

    expect(console.log).toHaveBeenCalledWith('Error:', errorMessage);
  }); */
});
