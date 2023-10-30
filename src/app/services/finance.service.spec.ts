import { TestBed } from '@angular/core/testing';

import { FinanceService } from './finance.service';
import { HttpClientModule } from '@angular/common/http';
import { Finance } from '../core/models/finance.model';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

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
describe('FinanceService', () => {
  let service: FinanceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [FinanceService],
    });
    service = TestBed.inject(FinanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Method createdNewProductFinance
  it('should create a new product finance', done => {
    const testData: Finance = productFinance;

    service.createdNewProductFinance(testData).subscribe(response => {
      expect(response).toEqual(testData);
      done();
    });

    const req = httpMock.expectOne(`${service.apiUrl}/bp/products`);
    expect(req.request.method).toBe('POST');
    req.flush(testData);
  });

  //

  it('should update a product finance', done => {
    const testData: Finance = productFinance;

    service.updateProductFinance(testData).subscribe(response => {
      expect(response).toEqual(testData);
      done();
    });

    const req = httpMock.expectOne(`${service.apiUrl}/bp/products`);
    expect(req.request.method).toBe('PUT');
    req.flush(testData);
  });

  it('should get a list of product finances', done => {
    const testData: Finance[] = [productFinance];

    service.getProductFinance().subscribe(response => {
      expect(response).toEqual(testData);
      done();
    });

    const req = httpMock.expectOne(`${service.apiUrl}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should delete a product finance', done => {
    const idToDelete = '123';

    service.deleteProductFinance(idToDelete).subscribe(response => {
      expect(response).toBeTruthy(); // Assuming your API returns a truthy value on successful delete
      done();
    });

    const req = httpMock.expectOne(
      `${service.apiUrl}/bp/products?id=${idToDelete}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Assuming your API returns an empty response on successful delete
  });
});
