import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { DEFAULT_MASK_GROUP, LOADING_MASK_HEADER } from './loading-mask/index'

@Injectable()
export class HttpService extends HttpClient {
  constructor(private httpHandler: HttpHandler) {
    super(httpHandler)
  }

  addInterceptor(interceptor: HttpInterceptor): HttpService {
    const handler: HttpHandler = new HttpInterceptorHandler(this.httpHandler, interceptor)
    return new HttpService(handler)
  }

  withLoadingMask(groupName: string = DEFAULT_MASK_GROUP): HttpService {
    return this.addInterceptor({
      intercept(req, next) {
        req = req.clone({
          setHeaders: { [LOADING_MASK_HEADER]: groupName },
        })
        return next.handle(req)
      }
    })
  }
}

class HttpInterceptorHandler implements HttpHandler {
  constructor(private next: HttpHandler, private interceptor: HttpInterceptor) { }

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(req, this.next)
  }
}
