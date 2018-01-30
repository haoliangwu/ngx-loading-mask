import { Directive, Input } from '@angular/core'
import { LoadingMaskService } from './loading-mask.service'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks'

@Directive({
  selector: '[ngxLoadingMask]'
})
export class LoadingMaskDirective implements OnInit {
  @Input() ngxLoadingMask: string

  constructor(
    private service: LoadingMaskService
  ) { }

  ngOnInit() {
    this.service.register(this.ngxLoadingMask)
  }
}
