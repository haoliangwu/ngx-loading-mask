# NgxLoadingMask
Angular 5+ simple loading-mask ui component. [DEMO](http://littlelyon.com/ngx-loading-mask/)

## Todo
* [x] global config
* [x] customizable loading snippet comp
  * [x] with global config
  * [x] with templateDef
* [x] mask container directive
* [x] events observable
* [x] ember layout support 
* [x] httpClient interceptor integrate
* [ ] docs
* [ ] unit-test cases

## Install
> ``npm install ngx-loading-mask --save``

Note: this lib depends on ``@angular/cdk/portal``, make sure you have installed it.

then just import ``LoadingMaskModule`` to ``AppModule``'s imports array
```
imports: [
  ...,
  LoadingMaskModule.forRoot(config)
]
```
### Config
* snippet(SnippetConfig): loading snippet config object
  * imgUrl(string): loading snippet uri, default: ``null``
  * size(number): snippet size(in px), default: ``144``
* mask(MaskConfig): loading mask config object
  * bgColor(string): loading mask background color, default: ``rgba(255, 255, 255, .7)``
* clsMapping(ClsMapping): class suffix
  * snip(string): loading snippet class suffix, default: ``ngx-loading-snip``
  * mask(string): loading mask class suffix, default: ``ngx-loading-mask`` 
* debug(boolean): toggle debug mode, default: ``false``

## Basic Usage
### global loading mask
just declare ``[ngxLoadingMask]`` into your app container element or ``body``
```
<div class="container" ngxLoadingMask>
    ...
</div>
```

### local loading mask
similar to global one, just declare the group name to [ngxLoadingMask] like
```
<div class="wrapper" [ngxLoadingMask]="'foo'">
    ...
</div>
```

### toggle mask
just use ``LoadingMaskService`` to toggle loading mask
```
// to show mask
this.service.showGroup(groupName)

// to hide mask 
this.toggleDone(groupName)
```
if groupName is ``undefined``, the default value of it was global loading mask group name, for sake of toggling local mask, you need assign local group name to it, like ``foo`` or something else.

## Advance Usage
In above section, the code style was imperative. If you want more declarative, we can use Angular ``httpClient`` interceptor feature.

Note: Until now, Angular ``httpClient`` api all have string type constraint, that means cannot patch custom metadata param into ``options``, this library used ``custom-header`` instead.

### use Angular httpClient service
with origin ``httpClient`` service, it is easy to patch ``headers``
```
http
  .post('/api/somthing/', body, {
    headers: new HttpHeaders().set('X-Loading-Mask', 'foo'),
  })
  .subscribe();
```
the loading mask metadata is bind to ``X-Loading-Mask`` key of the headers. The key has been exported as constant(LOADING_MASK_HEADER) of the module entry.

### use custom service extends httpClient
above code is relly ugly due to we must set ``HttpHeader`` manually but we only take care which loading mask should be toggle on during request process. The code could be more declarative by extending default ``httpClient`` service class and providing other custom api on it, something like
```
export class HttpService extends HttpClient {
  ...

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

  ...
}
```
then you can use it as 
```
http.withLoadingMask('foo')
  .post('/api/somthing/', body)
  .subscribe();
```
see whole example in [HERE](https://github.com/haoliangwu/ngx-loading-mask/tree/master/src/app/http.service.ts)

## API
### [ngxLoadingMask]
* ngxLoadingMask(string): loading mask group name, if null, use default global loading mask gorup name instead.

### LoadingMaskService
#### subscribe(groupName?: string): Observable<LoadingEvent>
get the loading mask events Observable corresponding to groupName, if groupName is undefined, will listen to all events

#### showGroup(groupName: string = DEFAULT_MASK_GROUP)
emit ``pending`` event of loading mask corresponding to groupName

#### hideGroup(groupName: string = DEFAULT_MASK_GROUP)
emit ``done`` event of loading mask corresponding to groupName

#### hideGroupError(groupName: string = DEFAULT_MASK_GROUP, error: any)
emit ``error`` event of loading mask corresponding to groupName, but throw error

#### isDefaultGroup(groupName: string): boolean
if a loading mask group is global default group

#### isDoneGroup(group: LoadingMaskGroup): boolean
if a loading mask group is in ``done`` status

#### getGroup(groupName: string, safe = false): LoadingMaskGroup
get group instance of groupName, if don't existed and ``safe = true``, set new group instance with groupName and return it

#### setGroup(groupName: string, replace = false): LoadingMaskGroup
set group instance of groupName, if ``replace = false``, will return exited group instance with corresponding groupName, otherwise, will replace current group instance with new one

#### register(groupName: string = DEFAULT_MASK_GROUP, replace = false): LoadingMaskGroup
register loading mask group instance

#### unregister(groupName: string)
unregister loading mask group instance
