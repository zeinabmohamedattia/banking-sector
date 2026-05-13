import { TestBed } from '@angular/core/testing';

import { TransactionsFiltersService } from './transactions-filters.service';

describe('TransactionsFiltersService', () => {
  let service: TransactionsFiltersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsFiltersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
