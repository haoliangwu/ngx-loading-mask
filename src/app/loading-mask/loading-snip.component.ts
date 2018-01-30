import { Component, OnInit, Inject, Input, ViewEncapsulation, Optional } from '@angular/core'
import { ClsMapping, Config } from './model/config'
import { CONFIG } from './config'
import { LoadingMaskDirective } from './loading-mask.directive'

@Component({
  selector: 'ngx-loading-snip',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './loading-snip.component.html',
  styleUrls: ['./loading-snip.component.scss']
})
export class LoadingSnipComponent implements OnInit {
  private cls: ClsMapping

  @Input() imgUrl: string
  @Input() size: number
  @Input() bgColor: string

  get maskCls() {
    return [this.cls.mask, !!this.mask ? '' : 'global']
  }

  get maskStyle() {
    return {
      'background': this.bgColor
    }
  }

  get snipCls() {
    return this.cls.snip
  }

  get snipStyle() {
    return {
      'width.px': this.size,
      'height.px': this.size
    }
  }

  constructor(
    @Inject(CONFIG) private config: Config,
    @Optional() private mask: LoadingMaskDirective
  ) { }

  ngOnInit() {
    this.cls = this.config.clsMapping
    this.imgUrl = this.imgUrl || this.config.snippet.imgUrl
    this.size = this.size || this.config.snippet.size
    this.bgColor = this.bgColor || this.config.mask.bgColor
  }
}
