import { InjectionToken } from '@angular/core'
import { Config } from './model/config'

export const DEFAULT_CONFIG: Config = {
  snippet: {
    imgUrl: null,
    size: 144
  },
  mask: {
    bgColor: 'rgba(255, 255, 255, .7)'
  },
  clsMapping: {
    mask: 'ngx-loading-mask',
    snip: 'ngx-loading-snip'
  },
  debug: false
}

export const LOADING_MASK_HEADER = 'X-Loading-Mask'

export const DEFAULT_MASK_GROUP = 'default_mask_group'

export const CONFIG = new InjectionToken<Config>('ngx.loadingMask.config')
