import { Component, OnInit, Inject, Input } from '@angular/core'
import { ClsMapping, Config } from './model/config'
import { CONFIG } from './config'

@Component({
  selector: 'ngx-loading-snip',
  templateUrl: './loading-snip.component.html',
  styleUrls: ['./loading-snip.component.css']
})
export class LoadingSnipComponent implements OnInit {
  private cls: ClsMapping

  @Input() imgUrl: string
  @Input() size: number

  get snipImgStyle(){
    return {
      'width.px': this.size,
      'height.px': this.size
    }
  }

  constructor(
    @Inject(CONFIG) private config: Config
  ) { }

  ngOnInit() {
    this.cls = this.config.clsMapping
    this.imgUrl = this.imgUrl || this.config.snippet.imgUrl
    this.size = this.size || this.config.snippet.size
  }
}
