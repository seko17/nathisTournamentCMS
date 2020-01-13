import { TestBed } from '@angular/core/testing';

import { Match2Service } from './match2.service';

describe('Match2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Match2Service = TestBed.get(Match2Service);
    expect(service).toBeTruthy();
  });
});
