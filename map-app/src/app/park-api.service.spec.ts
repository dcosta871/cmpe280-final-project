import { TestBed } from '@angular/core/testing';

import { ParkApiService } from './park-api.service';

describe('ParkApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParkApiService = TestBed.get(ParkApiService);
    expect(service).toBeTruthy();
  });
});
