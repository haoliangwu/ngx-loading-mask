import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoadingSnipComponent } from './loading-snip.component'
import { LoadingMaskDirective } from './loading-mask.directive'
import { Config } from './model/config'
import { CONFIG, DEFAULT_CONFIG } from './config'
import { LoadingMaskService } from './loading-mask.service'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { LoadingMaskInterceptor } from './loading-mask.interceptor'

export const CUSTOM_CONFIG = new InjectionToken<Config>('ngx.loadingMask.custom.config')

const configFactory = (config) => {
  return {...DEFAULT_CONFIG, ...config}
}

@NgModule({
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
})
export class LoadingMaskModule {
  static forRoot(config: Config): ModuleWithProviders {
    return {
      ngModule: LoadingMaskModule,
      providers: [
        LoadingMaskService,
        {
          provide: CUSTOM_CONFIG,
          useValue: config
        },
        {
          provide: CONFIG,
          useFactory: configFactory,
          deps: [CUSTOM_CONFIG]
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingMaskInterceptor,
          multi: true,
        }
      ]
    }
  }
}
