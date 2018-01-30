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

  togglePending(groupName: string, error: string) {
    this.service.showGroup(groupName)

    setTimeout(() => {
      if (error) {
        this.toggleError(groupName, error)
      } else {
        this.toggleDone(groupName)
      }
    }, 3000)
  }

  toggleDone(groupName: string) {
    this.service.hideGroup(groupName)
  }

  toggleError(groupName: string, error) {
    this.service.hideGroupError(groupName, error)
  }
}
