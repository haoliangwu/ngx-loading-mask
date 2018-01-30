import { InjectionToken } from '@angular/core'
import { Config } from './model/config'

export const DEFAULT_CONFIG: Config = {
  snippet: {
    imgUrl: '/assets/ripple.svg',
    size: 144
  },
  mask: {
    bgColor: 'rgba(255, 255, 255, .7)'
  },
  clsMapping: {
    mask: 'ngx-loading-mask',
    snip: 'ngx-loading-snip'
  }
}

export const CONFIG = new InjectionToken<Config>('ngx.loadingMask.config')
