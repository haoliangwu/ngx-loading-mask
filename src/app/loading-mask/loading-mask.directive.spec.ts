import { LoadingMaskDirective } from './loading-mask.directive'
import { LoadingMaskService } from './loading-mask.service';
import { TestBed, inject } from '@angular/core/testing';

describe('LoadingMaskDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingMaskDirective],
      providers: [LoadingMaskService]
    })
  })

  it('should create an instance', inject([LoadingMaskService], (service: LoadingMaskService) => {
    const directive = new LoadingMaskDirective(service)
    expect(directive).toBeTruthy()
  }))
})
