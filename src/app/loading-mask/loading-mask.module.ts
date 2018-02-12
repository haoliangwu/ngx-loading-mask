import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoadingSnipComponent } from './loading-snip.component'
import { LoadingMaskDirective } from './loading-mask.directive'
import { Config } from './model/config'
import { CONFIG, DEFAULT_CONFIG } from './config'
import { LoadingMaskService } from './loading-mask.service'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { LoadingMaskInterceptor } from './loading-mask.interceptor'

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
    const configFactory = () => {
      return {...DEFAULT_CONFIG, ...config}
    }

    return {
      ngModule: LoadingMaskModule,
      providers: [
        LoadingMaskService,
        {
          provide: CONFIG,
          useFactory: configFactory
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
