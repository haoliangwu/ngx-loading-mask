import { OnInit } from '@angular/core';
import { Config } from './model/config';
import { LoadingMaskDirective } from './loading-mask.directive';
export declare class LoadingSnipComponent implements OnInit {
    private config;
    mask: LoadingMaskDirective;
    private cls;
    imgUrl: string;
    size: number;
    bgColor: string;
    readonly maskCls: string[];
    readonly maskStyle: {
        'background': string;
    };
    readonly snipCls: string;
    readonly snipStyle: {
        'width.px': number;
        'height.px': number;
    };
    constructor(config: Config, mask: LoadingMaskDirective);
    ngOnInit(): void;
}
