import { TestBed, inject } from '@angular/core/testing';

import { LoadingMaskService } from './loading-mask.service';

describe('LoadingMaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingMaskService]
    });
  });

  it('should be created', inject([LoadingMaskService], (service: LoadingMaskService) => {
    expect(service).toBeTruthy();
  }));
});
