import { Component } from '@angular/core'
import { LoadingMaskService } from './loading-mask/loading-mask.service'

@Component({
  selector: 'ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-loading-mask'

  constructor(
    public service: LoadingMaskService
  ) {

  }
}
