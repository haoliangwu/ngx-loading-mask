import { LoadingMaskDirective } from './loading-mask.directive'
import { LoadingMaskService } from './loading-mask.service'
import { TestBed, inject } from '@angular/core/testing'
import { ComponentFactoryResolver, ApplicationRef, Injector, ElementRef } from '@angular/core'

export class MockElementRef extends ElementRef {
  constructor() { super(null) }
}

describe('LoadingMaskDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingMaskDirective],
      providers: [
        LoadingMaskService,
        { provide: ElementRef, useClass: MockElementRef }
      ]
    })
  })

  it('should create an instance', inject([LoadingMaskService, ComponentFactoryResolver, ApplicationRef, Injector, ElementRef], (service: LoadingMaskService, componentFactoryResolver, appRef, injector, el) => {
    const directive = new LoadingMaskDirective(service, componentFactoryResolver, appRef, injector, el)
    expect(directive).toBeTruthy()
  }))
})
