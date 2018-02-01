import { TestBed, inject } from '@angular/core/testing'

import { LoadingMaskService } from './loading-mask.service'
import { LoadingMaskModule } from './index'
import { take } from 'rxjs/operators/take'
import { LoadingEvent, LoadingStatus } from './model/event'

describe('LoadingMaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoadingMaskModule.forRoot({})
      ]
    })
  })

  it('should be created', inject([LoadingMaskService], (service: LoadingMaskService) => {
    expect(service).toBeTruthy()
  }))

  it('should default_mask_group be default name', inject([LoadingMaskService], (service: LoadingMaskService) => {
    expect(service.isDefaultGroup('foo')).toBe(false)
    expect(service.isDefaultGroup('default_mask_group')).toBe(true)
  }))

  it('should has default group registered', inject([LoadingMaskService], (service: LoadingMaskService) => {
    expect(service.getGroup('default_mask_group')).toEqual({
      uuid: 1,
      id: 'default_mask_group',
      pending: 0,
      done: 0,
      isError: false,
      instances: 1
    })
  }))

  it('should register/unregister works fine', inject([LoadingMaskService], (service: LoadingMaskService) => {
    service.register('foo')

    expect(service.getGroup('foo')).toEqual({
      uuid: 2,
      id: 'foo',
      pending: 0,
      done: 0,
      isError: false,
      instances: 1
    })

    service.register('foo')

    expect(service.getGroup('foo')).toEqual({
      uuid: 2,
      id: 'foo',
      pending: 0,
      done: 0,
      isError: false,
      instances: 2
    })

    service.unregister('foo')

    expect(service.getGroup('foo')).toEqual({
      uuid: 2,
      id: 'foo',
      pending: 0,
      done: 0,
      isError: false,
      instances: 1
    })
  }))

  it('should getGroup/setGroup works fine', inject([LoadingMaskService], (service: LoadingMaskService) => {
    expect(service.getGroup('foo')).toBeFalsy()
    expect(service.getGroup('foo', true)).toEqual({
      uuid: 2,
      id: 'foo',
      pending: 0,
      done: 0,
      isError: false,
      instances: 1
    })

    expect(service.setGroup('bar')).toEqual({
      uuid: 3,
      id: 'bar',
      pending: 0,
      done: 0,
      isError: false,
      instances: 1
    })
    expect(service.setGroup('bar')).toEqual({
      uuid: 3,
      id: 'bar',
      pending: 0,
      done: 0,
      isError: false,
      instances: 2
    })
    expect(service.setGroup('bar', true)).toEqual({
      uuid: 4,
      id: 'bar',
      pending: 0,
      done: 0,
      isError: false,
      instances: 1
    })
  }))

  it('should emit pending event', inject([LoadingMaskService], (service: LoadingMaskService) => {
    service.subscribe('foo').pipe(
      take(1)
    ).subscribe((e: LoadingEvent) => {

      expect(e).toEqual({
        id: 'foo',
        status: LoadingStatus.PENDING,
        data: undefined
      })
    })

    service.showGroup('foo')
  }))

  it('should emit done event', inject([LoadingMaskService], (service: LoadingMaskService) => {
    service.subscribe('foo').pipe(
      take(1)
    ).subscribe((e: LoadingEvent) => {
      expect(e).toEqual({
        id: 'foo',
        status: LoadingStatus.DONE,
        data: undefined
      })
    })

    service.hideGroup('foo')
  }))

  it('should emit error event', inject([LoadingMaskService], (service: LoadingMaskService) => {
    service.subscribe('foo').pipe(
      take(1)
    ).subscribe((e: LoadingEvent) => {
      expect(e).toEqual({
        id: 'foo',
        status: LoadingStatus.ERROR,
        data: 'error message'
      })
    })

    service.hideGroupError('foo', 'error message')
  }))
})
