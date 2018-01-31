import { Directive, Input, ComponentFactoryResolver, ApplicationRef, Injector, Host, ElementRef } from '@angular/core'
import { LoadingMaskService } from './loading-mask.service'
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable'
import { LoadingEvent, LoadingStatus } from './model/event'
import { LoadingMaskGroup } from './model/mask'

import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal'
import { LoadingSnipComponent } from './loading-snip.component'
import { catchError, tap, flatMap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { empty } from 'rxjs/observable/empty'


@Directive({
  selector: '[ngxLoadingMask]',
  exportAs: 'mask'
})
export class LoadingMaskDirective implements OnInit, OnDestroy {
  @Input() public ngxLoadingMask: string
  public isDefault = false

  private loadingEvent$: Observable<LoadingEvent>
  private subscription: Subscription
  private group: LoadingMaskGroup

  private loadingSnipPortal: ComponentPortal<LoadingSnipComponent>
  private portalHost: DomPortalHost
  private portalHostEl: HTMLElement

  constructor(
    private service: LoadingMaskService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    @Host() private el: ElementRef
  ) {
    this.handleEvent = this.handleEvent.bind(this)
  }

  ngOnInit() {
    this.group = this.service.register(this.ngxLoadingMask)

    const { id } = this.group

    this.isDefault = this.service.isDefaultGroup(id)
    this.loadingEvent$ = this.service.subscribe(id)

    this.loadingSnipPortal = new ComponentPortal(LoadingSnipComponent)
    this.portalHostEl = this.service.isDefaultGroup(id) ? document.body : this.el.nativeElement

    this.portalHost = new DomPortalHost(
      this.portalHostEl,
      this.componentFactoryResolver,
      this.appRef,
      this.injector)

    this.subscription = this.loadingEvent$.pipe(
      flatMap(e => {
        return of(e).pipe(
          tap(this.handleEvent),
          catchError((err, source) => {
            console.error(err)
            return empty()
          })
        )
      }))
      .subscribe()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  handleEvent(e: LoadingEvent) {
    switch (e.status) {
      case LoadingStatus.PENDING:
        console.log('pending', this.group.id)
        this.reveal()
        break
      case LoadingStatus.DONE:
        console.log('done', this.group.id)
        this.hide()
        break
      case LoadingStatus.ERROR:
        console.log('error', this.group.id)
        this.hideError(e.data)
        break
    }
  }

  reveal() {
    this.portalHost.attach(this.loadingSnipPortal)
  }

  hide() {
    this.portalHost.detach()
  }

  hideError(error: any) {
    this.hide()

    throw new Error(error)
  }
}
