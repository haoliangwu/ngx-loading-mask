import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoadingMaskService } from './loading-mask.service';
export declare class LoadingMaskInterceptor implements HttpInterceptor {
    private service;
    constructor(service: LoadingMaskService);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
