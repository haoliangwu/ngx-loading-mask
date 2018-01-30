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
  ) { }

  togglePending(groupName: string) {
    this.service.showGroup(groupName)

    setTimeout(() => {
      this.toggleDone(groupName)
    }, 3000)
  }

  toggleDone(groupName: string) {
    this.service.hideGroup(groupName)
  }

  toggleError(groupName: string) {
    this.service.hideGroupError(groupName)
  }
}
