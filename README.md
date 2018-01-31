# NgxLoadingMask
Angular 5+ simple loading-mask ui component.

## Todo
* [x] global config
* [x] customizable loading snippet comp
  * [x] with global config
  * [x] with templateDef
* [x] mask container directive
* [x] events observable
* [x] ember layout support 
* [ ] httpClient interceptor integrate
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

## Usage
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
