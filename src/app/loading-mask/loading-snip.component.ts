import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core'
import { Config } from './model/config'
import { CONFIG } from './config'
import { LoadingMaskDirective } from './loading-mask.directive'

@Component({
  selector: 'ngx-loading-snip',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './loading-snip.component.html',
  styleUrls: ['./loading-snip.component.scss']
})
export class LoadingSnipComponent implements OnInit {
  imgUrl: string
  size: number
  bgColor: string

  get maskCls() {
    return [this.config.clsMapping.mask, this.mask.isDefault ? 'global' : '']
  }

  get maskStyle() {
    return {
      'background': this.bgColor
    }
  }

  get snipCls() {
    return this.config.clsMapping.snip
  }

  get snipStyle() {
    return {
      'width.px': this.size,
      'height.px': this.size
    }
  }

  constructor(
    @Inject(CONFIG) private config: Config,
    public mask: LoadingMaskDirective
  ) { }

  ngOnInit() {
    this.imgUrl = this.config.snippet.imgUrl
    this.size = this.config.snippet.size
    this.bgColor = this.config.mask.bgColor
  }
}
