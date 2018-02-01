import { ApplicationRef, Component, ComponentFactoryResolver, ContentChild, Directive, ElementRef, Host, Inject, Injectable, InjectionToken, Injector, Input, NgModule, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject as BehaviorSubject$1 } from 'rxjs/BehaviorSubject';
import { catchError, filter, flatMap, tap } from 'rxjs/operators';
import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import { of as of$1 } from 'rxjs/observable/of';
import { empty as empty$1 } from 'rxjs/observable/empty';
import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpResponse } from '@angular/common/http';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const DEFAULT_CONFIG = {
    snippet: {
        imgUrl: null,
        size: 144
    },
    mask: {
        bgColor: 'rgba(255, 255, 255, .7)'
    },
    clsMapping: {
        mask: 'ngx-loading-mask',
        snip: 'ngx-loading-snip'
    },
    debug: false
};
const LOADING_MASK_HEADER = 'X-Loading-Mask';
const DEFAULT_MASK_GROUP = 'default_mask_group';
const CONFIG = new InjectionToken('ngx.loadingMask.config');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {string} */
const LoadingStatus = {
    INIT: '__init__',
    PENDING: 'pending',
    DONE: 'done',
    ERROR: 'error',
};
/**
 * @record
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class LoadingMaskService {
    /**
     * @param {?} config
     */
    constructor(config) {
        this.config = config;
        this.isSnipPreload = false;
        this.uuid = 1;
        this.loadingEvent$ = new BehaviorSubject$1({
            id: '__init__',
            status: LoadingStatus.INIT
        });
        this.bootstrap();
    }
    /**
     * @param {?=} groupName
     * @return {?}
     */
    subscribe(groupName) {
        if (!!groupName) {
            return this.loadingEvent$.pipe(filter(e => e.id === groupName));
        }
        else {
            return this.loadingEvent$.asObservable();
        }
    }
    /**
     * @param {?=} groupName
     * @param {?=} replace
     * @return {?}
     */
    register(groupName = DEFAULT_MASK_GROUP, replace = false) {
        if (groupName.length === 0) {
            groupName = DEFAULT_MASK_GROUP;
        }
        let /** @type {?} */ group;
        if (this.isDefaultGroup(groupName)) {
            group = this.getGroup(groupName, true);
        }
        else {
            group = this.setGroup(groupName, replace);
        }
        return group;
    }
    /**
     * @param {?} groupName
     * @return {?}
     */
    unregister(groupName) {
        if (this.isDefaultGroup(groupName)) {
            throw new Error('cannot unregister default loading mask group');
        }
        if (!this.maskGroupMap.has(groupName)) {
            throw new Error('cannot unregister non-existed loading mask group');
        }
        const /** @type {?} */ group = this.getGroup(groupName);
        group.instances--;
        if (group.instances === 0) {
            this.maskGroupMap.delete(groupName);
        }
    }
    /**
     * @param {?} groupName
     * @return {?}
     */
    isDefaultGroup(groupName) {
        return groupName === DEFAULT_MASK_GROUP;
    }
    /**
     * @param {?} group
     * @return {?}
     */
    isDoneGroup(group) {
        return group.done === group.pending;
    }
    /**
     * @param {?} groupName
     * @param {?=} safe
     * @return {?}
     */
    getGroup(groupName, safe = false) {
        if (this.maskGroupMap.has(groupName)) {
            return this.maskGroupMap.get(groupName);
        }
        else {
            if (safe) {
                return this.setGroup(groupName);
            }
        }
    }
    /**
     * @param {?} groupName
     * @param {?=} replace
     * @return {?}
     */
    setGroup(groupName, replace = false) {
        let /** @type {?} */ group;
        if (!replace && this.maskGroupMap.has(groupName)) {
            group = this.getGroup(groupName);
        }
        else {
            group = this.maskGroupFactory(groupName);
            this.maskGroupMap.set(groupName, group);
        }
        group.instances++;
        return group;
    }
    /**
     * @param {?=} groupName
     * @return {?}
     */
    showGroup(groupName = DEFAULT_MASK_GROUP) {
        this.loadingEvent$.next(this.loadingEventFactory(groupName, LoadingStatus.PENDING));
    }
    /**
     * @param {?=} groupName
     * @return {?}
     */
    hideGroup(groupName = DEFAULT_MASK_GROUP) {
        this.loadingEvent$.next(this.loadingEventFactory(groupName, LoadingStatus.DONE));
    }
    /**
     * @param {?=} groupName
     * @param {?=} error
     * @return {?}
     */
    hideGroupError(groupName = DEFAULT_MASK_GROUP, error) {
        this.loadingEvent$.next(this.loadingEventFactory(groupName, LoadingStatus.ERROR, error));
    }
    /**
     * @return {?}
     */
    preloadImage() {
        if (this.isSnipPreload)
            return;
        const { snippet: { imgUrl } } = this.config;
        console.group('starting preload snip image from:', imgUrl);
        this.isSnipPreload = true;
        const /** @type {?} */ img = new Image();
        img.src = imgUrl;
        img.onload = () => {
            console.log('preloaded sucessfully');
            console.groupEnd();
            this.isSnipPreload = true;
        };
        img.onerror = () => {
            console.log('preloaded met some error');
            console.groupEnd();
            this.isSnipPreload = false;
        };
    }
    /**
     * @return {?}
     */
    bootstrap() {
        this.maskGroupMap = new Map();
        this.setGroup(DEFAULT_MASK_GROUP, true);
    }
    /**
     * @param {?} groupName
     * @param {?} status
     * @param {?=} data
     * @return {?}
     */
    loadingEventFactory(groupName, status, data) {
        return {
            id: groupName,
            status,
            data
        };
    }
    /**
     * @param {?} groupName
     * @return {?}
     */
    maskGroupFactory(groupName) {
        return {
            uuid: this.uuid++,
            id: groupName,
            pending: 0,
            done: 0,
            isError: false,
            instances: 0
        };
    }
}
LoadingMaskService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
LoadingMaskService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [CONFIG,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const logGroupStatus = function (group, status) {
    console.group(`group %s is ${status}`, group.id);
    console.log(group);
    console.groupEnd();
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class LoadingMaskDirective {
    /**
     * @param {?} config
     * @param {?} service
     * @param {?} componentFactoryResolver
     * @param {?} appRef
     * @param {?} injector
     * @param {?} el
     */
    constructor(config, service, componentFactoryResolver, appRef, injector, el) {
        this.config = config;
        this.service = service;
        this.componentFactoryResolver = componentFactoryResolver;
        this.appRef = appRef;
        this.injector = injector;
        this.el = el;
        this.isDefault = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.group = this.service.register(this.ngxLoadingMask);
        this.config = Object.assign(DEFAULT_CONFIG, this.config);
        this.service.preloadImage();
        const { id } = this.group;
        this.isDefault = this.service.isDefaultGroup(id);
        this.loadingEvent$ = this.service.subscribe(id);
        this.loadingSnipPortal = new ComponentPortal(LoadingSnipComponent);
        this.portalHostEl = this.service.isDefaultGroup(id) ? document.body : this.el.nativeElement;
        this.portalHost = new DomPortalHost(this.portalHostEl, this.componentFactoryResolver, this.appRef, this.injector);
        this.subscription = this.loadingEvent$.pipe(flatMap(e => {
            return of$1(e).pipe(tap(t => this.handleEvent(t)), catchError((err, source) => {
                console.error(err);
                return empty$1();
            }));
        }))
            .subscribe();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    /**
     * @param {?} e
     * @return {?}
     */
    handleEvent(e) {
        switch (e.status) {
            case LoadingStatus.PENDING:
                this.group.pending++;
                if (this.group.isError)
                    this.group.isError = false;
                if (this.config.debug) {
                    logGroupStatus(this.group, LoadingStatus.PENDING);
                }
                if (this.portalHost.hasAttached())
                    return;
                else
                    this.reveal();
                break;
            case LoadingStatus.DONE:
                this.group.done++;
                if (this.config.debug) {
                    logGroupStatus(this.group, LoadingStatus.DONE);
                }
                if (this.service.isDoneGroup(this.group)) {
                    this.group.done = 0;
                    this.group.pending = 0;
                    this.hide();
                }
                break;
            case LoadingStatus.ERROR:
                this.group.done = 0;
                this.group.pending = 0;
                this.group.isError = true;
                if (this.config.debug) {
                    logGroupStatus(this.group, LoadingStatus.ERROR);
                }
                this.hideError(e.data);
                break;
        }
    }
    /**
     * @return {?}
     */
    reveal() {
        // TODO track https://github.com/angular/material2/issues/8628
        // this.portalHost.attachComponentPortal(this.loadingSnipPortal)
        this.portalHost.attach(this.loadingSnipPortal);
    }
    /**
     * @return {?}
     */
    hide() {
        this.portalHost.detach();
    }
    /**
     * @param {?} error
     * @return {?}
     */
    hideError(error) {
        this.hide();
        throw new Error(error);
    }
}
LoadingMaskDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngxLoadingMask]',
                exportAs: 'mask'
            },] },
];
/** @nocollapse */
LoadingMaskDirective.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [CONFIG,] },] },
    { type: LoadingMaskService, },
    { type: ComponentFactoryResolver, },
    { type: ApplicationRef, },
    { type: Injector, },
    { type: ElementRef, decorators: [{ type: Host },] },
];
LoadingMaskDirective.propDecorators = {
    "ngxLoadingMask": [{ type: Input },],
    "maskTplRef": [{ type: ContentChild, args: ['mask',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class LoadingSnipComponent {
    /**
     * @param {?} config
     * @param {?} mask
     */
    constructor(config, mask) {
        this.config = config;
        this.mask = mask;
    }
    /**
     * @return {?}
     */
    get maskCls() {
        return [this.cls.mask, this.mask.isDefault ? 'global' : ''];
    }
    /**
     * @return {?}
     */
    get maskStyle() {
        return {
            'background': this.bgColor
        };
    }
    /**
     * @return {?}
     */
    get snipCls() {
        return this.cls.snip;
    }
    /**
     * @return {?}
     */
    get snipStyle() {
        return {
            'width.px': this.size,
            'height.px': this.size
        };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.config = Object.assign(DEFAULT_CONFIG, this.config);
        this.cls = this.config.clsMapping;
        this.imgUrl = this.config.snippet.imgUrl;
        this.size = this.config.snippet.size;
        this.bgColor = this.config.mask.bgColor;
    }
}
LoadingSnipComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-loading-snip',
                encapsulation: ViewEncapsulation.None,
                template: `<div class="loading-mask-base" [ngClass]="maskCls" [ngStyle]="maskStyle">
  <div class="loading-snip-base" [ngClass]="snipCls">
    <img *ngIf="!mask.maskTplRef" [attr.src]="imgUrl" [ngStyle]="snipStyle"/>
    <ng-container *ngIf="mask.maskTplRef">
        <ng-container *ngTemplateOutlet="mask.maskTplRef">
        </ng-container>
      </ng-container>
  </div>
</div>
`,
                styles: [`.loading-mask-base {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  z-index: 99; }
  .loading-mask-base.global {
    position: fixed;
    width: 100vw;
    height: 100vh; }

.loading-snip-base {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%); }
`]
            },] },
];
/** @nocollapse */
LoadingSnipComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [CONFIG,] },] },
    { type: LoadingMaskDirective, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class LoadingMaskInterceptor {
    /**
     * @param {?} service
     */
    constructor(service) {
        this.service = service;
    }
    /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    intercept(req, next) {
        if (req.headers.has(LOADING_MASK_HEADER)) {
            // TODO use custom header as custom metadata, maybe deprecated in the future
            // refer to https://github.com/angular/angular/issues/18155
            const /** @type {?} */ groupName = req.headers.get(LOADING_MASK_HEADER);
            req = req.clone({
                headers: req.headers.delete(LOADING_MASK_HEADER)
            });
            this.service.showGroup(groupName);
            return next.handle(req).pipe(tap(event => {
                if (event instanceof HttpResponse) {
                    // TODO hide mask here
                    this.service.hideGroup(groupName);
                }
            }, error => {
                if (error instanceof HttpErrorResponse) {
                    // TODO hide mask with error here
                    this.service.hideGroupError(groupName, error);
                }
            }));
        }
        else {
            return next.handle(req);
        }
    }
}
LoadingMaskInterceptor.decorators = [
    { type: Injectable },
];
/** @nocollapse */
LoadingMaskInterceptor.ctorParameters = () => [
    { type: LoadingMaskService, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class LoadingMaskModule {
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: LoadingMaskModule,
            providers: [
                LoadingMaskService,
                {
                    useValue: config,
                    provide: CONFIG
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: LoadingMaskInterceptor,
                    multi: true,
                }
            ]
        };
    }
}
LoadingMaskModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    LoadingSnipComponent,
                    LoadingMaskDirective
                ],
                exports: [
                    LoadingMaskDirective
                ],
                entryComponents: [
                    LoadingSnipComponent
                ]
            },] },
];
/** @nocollapse */
LoadingMaskModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { LoadingMaskModule, DEFAULT_CONFIG, LOADING_MASK_HEADER, DEFAULT_MASK_GROUP, CONFIG, LoadingMaskDirective as ɵc, LoadingMaskInterceptor as ɵe, LoadingMaskService as ɵd, LoadingSnipComponent as ɵa };
//# sourceMappingURL=ngx-loading-mask.js.map
