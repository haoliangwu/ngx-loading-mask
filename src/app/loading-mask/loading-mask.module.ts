import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoadingSnipComponent } from './loading-snip.component'
import { LoadingMaskDirective } from './loading-mask.directive'
import { Config } from './model/config'
import { CONFIG, DEFAULT_CONFIG } from './config'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [LoadingSnipComponent, LoadingMaskDirective]
})
export class LoadingMaskModule {
  static forRoot(config: Config = DEFAULT_CONFIG): ModuleWithProviders {
    return {
      ngModule: LoadingMaskModule,
      providers: [
        {
          useValue: config,
          provide: CONFIG
        }
      ]
    }
  }
}
