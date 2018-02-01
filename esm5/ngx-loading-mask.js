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
var DEFAULT_CONFIG = {
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
var LOADING_MASK_HEADER = 'X-Loading-Mask';
var DEFAULT_MASK_GROUP = 'default_mask_group';
var CONFIG = new InjectionToken('ngx.loadingMask.config');
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {string} */
var LoadingStatus = {
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
var LoadingMaskService = (function () {
    /**
     * @param {?} config
     */
    function LoadingMaskService(config) {
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
    LoadingMaskService.prototype.subscribe = function (groupName) {
        if (!!groupName) {
            return this.loadingEvent$.pipe(filter(function (e) { return e.id === groupName; }));
        }
        else {
            return this.loadingEvent$.asObservable();
        }
    };
    /**
     * @param {?=} groupName
     * @param {?=} replace
     * @return {?}
     */
    LoadingMaskService.prototype.register = function (groupName, replace) {
        if (groupName === void 0) { groupName = DEFAULT_MASK_GROUP; }
        if (replace === void 0) { replace = false; }
        if (groupName.length === 0) {
            groupName = DEFAULT_MASK_GROUP;
        }
        var /** @type {?} */ group;
        if (this.isDefaultGroup(groupName)) {
            group = this.getGroup(groupName, true);
        }
        else {
            group = this.setGroup(groupName, replace);
        }
        return group;
    };
    /**
     * @param {?} groupName
     * @return {?}
     */
    LoadingMaskService.prototype.unregister = function (groupName) {
        if (this.isDefaultGroup(groupName)) {
            throw new Error('cannot unregister default loading mask group');
        }
        if (!this.maskGroupMap.has(groupName)) {
            throw new Error('cannot unregister non-existed loading mask group');
        }
        var /** @type {?} */ group = this.getGroup(groupName);
        group.instances--;
        if (group.instances === 0) {
            this.maskGroupMap.delete(groupName);
        }
    };
    /**
     * @param {?} groupName
     * @return {?}
     */
    LoadingMaskService.prototype.isDefaultGroup = function (groupName) {
        return groupName === DEFAULT_MASK_GROUP;
    };
    /**
     * @param {?} group
     * @return {?}
     */
    LoadingMaskService.prototype.isDoneGroup = function (group) {
        return group.done === group.pending;
    };
    /**
     * @param {?} groupName
     * @param {?=} safe
     * @return {?}
     */
    LoadingMaskService.prototype.getGroup = function (groupName, safe) {
        if (safe === void 0) { safe = false; }
        if (this.maskGroupMap.has(groupName)) {
            return this.maskGroupMap.get(groupName);
        }
        else {
            if (safe) {
                return this.setGroup(groupName);
            }
        }
    };
    /**
     * @param {?} groupName
     * @param {?=} replace
     * @return {?}
     */
    LoadingMaskService.prototype.setGroup = function (groupName, replace) {
        if (replace === void 0) { replace = false; }
        var /** @type {?} */ group;
        if (!replace && this.maskGroupMap.has(groupName)) {
            group = this.getGroup(groupName);
        }
        else {
            group = this.maskGroupFactory(groupName);
            this.maskGroupMap.set(groupName, group);
        }
        group.instances++;
        return group;
    };
    /**
     * @param {?=} groupName
     * @return {?}
     */
    LoadingMaskService.prototype.showGroup = function (groupName) {
        if (groupName === void 0) { groupName = DEFAULT_MASK_GROUP; }
        this.loadingEvent$.next(this.loadingEventFactory(groupName, LoadingStatus.PENDING));
    };
    /**
     * @param {?=} groupName
     * @return {?}
     */
    LoadingMaskService.prototype.hideGroup = function (groupName) {
        if (groupName === void 0) { groupName = DEFAULT_MASK_GROUP; }
        this.loadingEvent$.next(this.loadingEventFactory(groupName, LoadingStatus.DONE));
    };
    /**
     * @param {?=} groupName
     * @param {?=} error
     * @return {?}
     */
    LoadingMaskService.prototype.hideGroupError = function (groupName, error) {
        if (groupName === void 0) { groupName = DEFAULT_MASK_GROUP; }
        this.loadingEvent$.next(this.loadingEventFactory(groupName, LoadingStatus.ERROR, error));
    };
    /**
     * @return {?}
     */
    LoadingMaskService.prototype.preloadImage = function () {
        var _this = this;
        if (this.isSnipPreload)
            return;
        var imgUrl = this.config.snippet.imgUrl;
        console.group('starting preload snip image from:', imgUrl);
        this.isSnipPreload = true;
        var /** @type {?} */ img = new Image();
        img.src = imgUrl;
        img.onload = function () {
            console.log('preloaded sucessfully');
            console.groupEnd();
            _this.isSnipPreload = true;
        };
        img.onerror = function () {
            console.log('preloaded met some error');
            console.groupEnd();
            _this.isSnipPreload = false;
        };
    };
    /**
     * @return {?}
     */
    LoadingMaskService.prototype.bootstrap = function () {
        this.maskGroupMap = new Map();
        this.setGroup(DEFAULT_MASK_GROUP, true);
    };
    /**
     * @param {?} groupName
     * @param {?} status
     * @param {?=} data
     * @return {?}
     */
    LoadingMaskService.prototype.loadingEventFactory = function (groupName, status, data) {
        return {
            id: groupName,
            status: status,
            data: data
        };
    };
    /**
     * @param {?} groupName
     * @return {?}
     */
    LoadingMaskService.prototype.maskGroupFactory = function (groupName) {
        return {
            uuid: this.uuid++,
            id: groupName,
            pending: 0,
            done: 0,
            isError: false,
            instances: 0
        };
    };
    return LoadingMaskService;
}());
LoadingMaskService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
LoadingMaskService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [CONFIG,] },] },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var logGroupStatus = function (group, status) {
    console.group("group %s is " + status, group.id);
    console.log(group);
    console.groupEnd();
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var LoadingMaskDirective = (function () {
    /**
     * @param {?} config
     * @param {?} service
     * @param {?} componentFactoryResolver
     * @param {?} appRef
     * @param {?} injector
     * @param {?} el
     */
    function LoadingMaskDirective(config, service, componentFactoryResolver, appRef, injector, el) {
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
    LoadingMaskDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.group = this.service.register(this.ngxLoadingMask);
        this.config = Object.assign(DEFAULT_CONFIG, this.config);
        this.service.preloadImage();
        var id = this.group.id;
        this.isDefault = this.service.isDefaultGroup(id);
        this.loadingEvent$ = this.service.subscribe(id);
        this.loadingSnipPortal = new ComponentPortal(LoadingSnipComponent);
        this.portalHostEl = this.service.isDefaultGroup(id) ? document.body : this.el.nativeElement;
        this.portalHost = new DomPortalHost(this.portalHostEl, this.componentFactoryResolver, this.appRef, this.injector);
        this.subscription = this.loadingEvent$.pipe(flatMap(function (e) {
            return of$1(e).pipe(tap(function (t) { return _this.handleEvent(t); }), catchError(function (err, source) {
                console.error(err);
                return empty$1();
            }));
        }))
            .subscribe();
    };
    /**
     * @return {?}
     */
    LoadingMaskDirective.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    /**
     * @param {?} e
     * @return {?}
     */
    LoadingMaskDirective.prototype.handleEvent = function (e) {
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
    };
    /**
     * @return {?}
     */
    LoadingMaskDirective.prototype.reveal = function () {
        // TODO track https://github.com/angular/material2/issues/8628
        // this.portalHost.attachComponentPortal(this.loadingSnipPortal)
        this.portalHost.attach(this.loadingSnipPortal);
    };
    /**
     * @return {?}
     */
    LoadingMaskDirective.prototype.hide = function () {
        this.portalHost.detach();
    };
    /**
     * @param {?} error
     * @return {?}
     */
    LoadingMaskDirective.prototype.hideError = function (error) {
        this.hide();
        throw new Error(error);
    };
    return LoadingMaskDirective;
}());
LoadingMaskDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngxLoadingMask]',
                exportAs: 'mask'
            },] },
];
/** @nocollapse */
LoadingMaskDirective.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [CONFIG,] },] },
    { type: LoadingMaskService, },
    { type: ComponentFactoryResolver, },
    { type: ApplicationRef, },
    { type: Injector, },
    { type: ElementRef, decorators: [{ type: Host },] },
]; };
LoadingMaskDirective.propDecorators = {
    "ngxLoadingMask": [{ type: Input },],
    "maskTplRef": [{ type: ContentChild, args: ['mask',] },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var LoadingSnipComponent = (function () {
    /**
     * @param {?} config
     * @param {?} mask
     */
    function LoadingSnipComponent(config, mask) {
        this.config = config;
        this.mask = mask;
    }
    Object.defineProperty(LoadingSnipComponent.prototype, "maskCls", {
        /**
         * @return {?}
         */
        get: function () {
            return [this.cls.mask, this.mask.isDefault ? 'global' : ''];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingSnipComponent.prototype, "maskStyle", {
        /**
         * @return {?}
         */
        get: function () {
            return {
                'background': this.bgColor
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingSnipComponent.prototype, "snipCls", {
        /**
         * @return {?}
         */
        get: function () {
            return this.cls.snip;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoadingSnipComponent.prototype, "snipStyle", {
        /**
         * @return {?}
         */
        get: function () {
            return {
                'width.px': this.size,
                'height.px': this.size
            };
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    LoadingSnipComponent.prototype.ngOnInit = function () {
        this.config = Object.assign(DEFAULT_CONFIG, this.config);
        this.cls = this.config.clsMapping;
        this.imgUrl = this.config.snippet.imgUrl;
        this.size = this.config.snippet.size;
        this.bgColor = this.config.mask.bgColor;
    };
    return LoadingSnipComponent;
}());
LoadingSnipComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-loading-snip',
                encapsulation: ViewEncapsulation.None,
                template: "<div class=\"loading-mask-base\" [ngClass]=\"maskCls\" [ngStyle]=\"maskStyle\">\n  <div class=\"loading-snip-base\" [ngClass]=\"snipCls\">\n    <img *ngIf=\"!mask.maskTplRef\" [attr.src]=\"imgUrl\" [ngStyle]=\"snipStyle\"/>\n    <ng-container *ngIf=\"mask.maskTplRef\">\n        <ng-container *ngTemplateOutlet=\"mask.maskTplRef\">\n        </ng-container>\n      </ng-container>\n  </div>\n</div>\n",
                styles: [".loading-mask-base {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  z-index: 99; }\n  .loading-mask-base.global {\n    position: fixed;\n    width: 100vw;\n    height: 100vh; }\n\n.loading-snip-base {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%); }\n"]
            },] },
];
/** @nocollapse */
LoadingSnipComponent.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [CONFIG,] },] },
    { type: LoadingMaskDirective, },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var LoadingMaskInterceptor = (function () {
    /**
     * @param {?} service
     */
    function LoadingMaskInterceptor(service) {
        this.service = service;
    }
    /**
     * @param {?} req
     * @param {?} next
     * @return {?}
     */
    LoadingMaskInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        if (req.headers.has(LOADING_MASK_HEADER)) {
            // TODO use custom header as custom metadata, maybe deprecated in the future
            // refer to https://github.com/angular/angular/issues/18155
            var /** @type {?} */ groupName_1 = req.headers.get(LOADING_MASK_HEADER);
            req = req.clone({
                headers: req.headers.delete(LOADING_MASK_HEADER)
            });
            this.service.showGroup(groupName_1);
            return next.handle(req).pipe(tap(function (event) {
                if (event instanceof HttpResponse) {
                    // TODO hide mask here
                    _this.service.hideGroup(groupName_1);
                }
            }, function (error) {
                if (error instanceof HttpErrorResponse) {
                    // TODO hide mask with error here
                    _this.service.hideGroupError(groupName_1, error);
                }
            }));
        }
        else {
            return next.handle(req);
        }
    };
    return LoadingMaskInterceptor;
}());
LoadingMaskInterceptor.decorators = [
    { type: Injectable },
];
/** @nocollapse */
LoadingMaskInterceptor.ctorParameters = function () { return [
    { type: LoadingMaskService, },
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var LoadingMaskModule = (function () {
    function LoadingMaskModule() {
    }
    /**
     * @param {?} config
     * @return {?}
     */
    LoadingMaskModule.forRoot = function (config) {
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
    };
    return LoadingMaskModule;
}());
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
LoadingMaskModule.ctorParameters = function () { return []; };
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
