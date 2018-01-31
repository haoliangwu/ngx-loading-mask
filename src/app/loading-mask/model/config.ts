export interface ClsMapping {
  snip: string,
  mask: string
}

export interface SnippetConfig {
  imgUrl: string,
  size: number
}

export interface MaskConfig {
  bgColor: string
}

export interface Config {
  snippet?: SnippetConfig
  mask?: MaskConfig,
  clsMapping?: ClsMapping,
  debug?: boolean
}
