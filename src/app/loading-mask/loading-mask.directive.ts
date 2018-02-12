import { Directive, Input, ComponentFactoryResolver, ApplicationRef, Injector, Host, ElementRef, Inject, ContentChild, TemplateRef } from '@angular/core'
import { LoadingMaskService } from './loading-mask.service'
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { LoadingEvent, LoadingStatus } from './model/event'
import { LoadingMaskGroup } from './model/mask'

import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal'
import { LoadingSnipComponent } from './loading-snip.component'
import { catchError, tap, flatMap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { empty } from 'rxjs/observable/empty'
import { Config } from './model/config'
import { CONFIG } from './config'
import { logGroupStatus } from './utils/log'

@Directive({
  selector: '[ngxLoadingMask]',
  exportAs: 'mask'
})
export class LoadingMaskDirective implements OnInit, OnDestroy {
  @Input() public ngxLoadingMask: string
  public isDefault = false
  @ContentChild('mask') public maskTplRef: TemplateRef<any>

  private loadingEvent$: Observable<LoadingEvent>
  private subscription: Subscription
  private group: LoadingMaskGroup

  private loadingSnipPortal: ComponentPortal<LoadingSnipComponent>
  private portalHost: DomPortalHost
  private portalHostEl: HTMLElement

  constructor(
    @Inject(CONFIG) private config: Config,
    private service: LoadingMaskService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    @Host() public el: ElementRef
  ) { }

  ngOnInit() {
    this.group = this.service.register(this.ngxLoadingMask)

    this.service.preloadImage()

    const { id } = this.group

    this.portalHostEl = this.service.isDefaultGroup(id) ? document.body : this.el.nativeElement

    this.portalHost = new DomPortalHost(
      this.portalHostEl,
      this.componentFactoryResolver,
      this.appRef,
      this.injector)

    this.loadingSnipPortal = new ComponentPortal(LoadingSnipComponent)

    this.isDefault = this.service.isDefaultGroup(id)
    this.loadingEvent$ = this.service.subscribe(id)

    this.subscription = this.loadingEvent$.pipe(
      flatMap(e => {
        return of(e).pipe(
          tap(t => this.handleEvent(t)),
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

  private handleEvent(e: LoadingEvent) {
    switch (e.status) {
      case LoadingStatus.PENDING:
        this.group.pending++
        if (this.group.isError) this.group.isError = false

        if (this.config.debug) {
          logGroupStatus(this.group, LoadingStatus.PENDING)
        }

        if (this.portalHost.hasAttached()) return
        else this.reveal()

        break
      case LoadingStatus.DONE:
        this.group.done++

        if (this.config.debug) {
          logGroupStatus(this.group, LoadingStatus.DONE)
        }

        if (this.service.isDoneGroup(this.group)) {
          this.group.done = 0
          this.group.pending = 0

          this.hide()
        }

        break
      case LoadingStatus.ERROR:
        this.group.done = 0
        this.group.pending = 0

        this.group.isError = true

        if (this.config.debug) {
          logGroupStatus(this.group, LoadingStatus.ERROR)
        }

        this.hideError(e.data)

        break
    }
  }

  reveal() {
    // TODO track https://github.com/angular/material2/issues/8628
    // this.portalHost.attachComponentPortal(this.loadingSnipPortal)

    const component = this.portalHost.attach(this.loadingSnipPortal)

    // need detect chagnes manually for ExpressionChangedAfterItHasBeenCheckedError error
    // don't figure out the reason, maybe the root cause was cdk inject component outside angular scope
    component.changeDetectorRef.detectChanges()
  }

  hide() {
    this.portalHost.detach()
  }

  hideError(error: any) {
    this.hide()

    throw new Error(error)
  }
}
