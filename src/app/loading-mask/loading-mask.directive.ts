import { Directive, Input, forwardRef, Inject } from '@angular/core'
import { LoadingMaskService } from './loading-mask.service'
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable'
import { LoadingEvent, LoadingStatus } from './model/event'
import { LoadingMaskGroup } from './model/mask';

@Directive({
  selector: '[ngxLoadingMask]',
  exportAs: 'mask'
})
export class LoadingMaskDirective implements OnInit, OnDestroy {
  @Input() ngxLoadingMask: string

  private loadingEvent$: Observable<LoadingEvent>
  private subscription: Subscription

  private group: LoadingMaskGroup

  constructor(
    @Inject(forwardRef(() => LoadingMaskService)) private service: LoadingMaskService
  ) {
    this.handleEvent = this.handleEvent.bind(this)
  }

  ngOnInit() {
    this.group = this.service.register(this.ngxLoadingMask)
    this.loadingEvent$ = this.service.subscribe(this.group.id)

    this.subscription = this.loadingEvent$
      .subscribe(this.handleEvent)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  handleEvent(e: LoadingEvent) {
    switch (e.status) {
      case LoadingStatus.PENDING:
        console.log('pending', this.group.id)
        break
      case LoadingStatus.DONE:
        console.log('done', this.group.id)
        break
      case LoadingStatus.ERROR:
        console.log('error', this.group.id)
        break
    }
  }
}
