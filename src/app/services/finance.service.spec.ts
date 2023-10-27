import { TestBed } from '@angular/core/testing';

import { FinanceService } from './finance.service';
import { HttpClientModule } from '@angular/common/http';

describe('FinanceService', () => {
  let service: FinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [FinanceService],
    });
    service = TestBed.inject(FinanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
