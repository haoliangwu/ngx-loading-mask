import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class HttpService extends HttpClient {
  constructor(private httpHandler: HttpHandler) {
    super(httpHandler)
  }

  addInterceptor(interceptor: HttpInterceptor): HttpService {
    const handler: HttpHandler = new HttpInterceptorHandler(this.httpHandler, interceptor)
    return new HttpService(handler)
  }

  noCache(): HttpService {
    return this.addInterceptor({
      intercept(req, next) {
        req = req.clone({
          setHeaders: { 'Pragma': 'no-cache' },
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
