import { TestBed } from '@angular/core/testing';

import { AllserveService } from './allserve.service';

describe('AllserveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllserveService = TestBed.get(AllserveService);
    expect(service).toBeTruthy();
  });
});
