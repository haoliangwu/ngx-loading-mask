import { ComponentFactoryResolver, ApplicationRef, Injector, ElementRef, TemplateRef } from '@angular/core';
import { LoadingMaskService } from './loading-mask.service';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Config } from './model/config';
export declare class LoadingMaskDirective implements OnInit, OnDestroy {
    private config;
    private service;
    private componentFactoryResolver;
    private appRef;
    private injector;
    private el;
    ngxLoadingMask: string;
    isDefault: boolean;
    maskTplRef: TemplateRef<any>;
    private loadingEvent$;
    private subscription;
    private group;
    private loadingSnipPortal;
    private portalHost;
    private portalHostEl;
    constructor(config: Config, service: LoadingMaskService, componentFactoryResolver: ComponentFactoryResolver, appRef: ApplicationRef, injector: Injector, el: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private handleEvent(e);
    reveal(): void;
    hide(): void;
    hideError(error: any): void;
}
