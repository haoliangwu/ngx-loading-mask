import { Injectable } from '@angular/core'
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'
import { LoadingMaskService } from './loading-mask.service'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoadingMaskInterceptor implements HttpInterceptor {
  constructor(
    private service: LoadingMaskService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.headers.has('X-Loading-Mask')) {
      // TODO use custom header as custom metadata, maybe deprecated in the future
      // refer to https://github.com/angular/angular/issues/18155
      const groupName = req.headers.get('X-Loading-Mask')

      req = req.clone({
        headers: req.headers.delete('X-Loading-Mask')
      })

      this.service.showGroup(groupName)

      return next.handle(req).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            // TODO hide mask here
            this.service.hideGroup(groupName)
          }
        }, error => {
          if (error instanceof HttpErrorResponse) {
            // TODO hide mask with error here
            this.service.hideGroupError(groupName, error)
          }
        })
      )
    } else {
      return next.handle(req)
    }
  }
}
