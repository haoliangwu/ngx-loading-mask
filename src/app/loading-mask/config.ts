import { InjectionToken } from '@angular/core'
import { Config } from './model/config'

export const DEFAULT_CONFIG: Config = {
  snippet: {
    bgColor: 'rgba(0, 0, 0, .12)',
    maskCls: 'ngx-loading-mask'
  }
}

export const CONFIG = new InjectionToken<Config>('ngx.loadingMask.config')
