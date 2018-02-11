import { Component, ViewEncapsulation } from '@angular/core'

import { LoadingMaskService } from './loading-mask/loading-mask.service'
import { FormGroup, FormBuilder } from '@angular/forms'
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks'
import { skip } from 'rxjs/operators'
import { HttpService } from './http.service'
import { DEFAULT_MASK_GROUP } from './loading-mask/index'

@Component({
  selector: 'ngx-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngx-loading-mask'
  validateForm: FormGroup
  isError = false
  isData = false
  isCustom = false
  customMessage = 'custom loading template'
  defaultGroup = DEFAULT_MASK_GROUP
  logs: string[] = []

  timeoutMarks = {
    1: '1s',
    2: '2s',
    3: '3s',
    4: '4s',
    5: '5s'
  }

  constructor(
    private fb: FormBuilder,
    public service: LoadingMaskService,
    private httpClient: HttpService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      zone: [DEFAULT_MASK_GROUP],
      isData: [false],
      isError: [false],
      isCustom: [false],
      customMessage: [this.customMessage],
      errorMessage: ['foo'],
      timeout: [1],
      count: [1]
    })

    this.validateForm.get('customMessage').valueChanges
      .subscribe(e => {
        this.customMessage = e
      })

    this.validateForm.get('isCustom').valueChanges
      .subscribe(e => {
        this.isCustom = e
      })

    this.validateForm.get('isError').valueChanges
      .subscribe(e => {
        this.isError = e
      })

    this.validateForm.get('isData').valueChanges
      .subscribe(e => {
        this.isData = e
      })

    this.service.subscribe()
      .pipe(skip(1))
      .subscribe(e => {
        const timestamp = this.isData ? `at ${new Date().getTime()}` : ''

        this.logs.push(`<span class="highlight">${e.id}</span> group in <span class="highlight">${e.status}</span> status ${timestamp}`)
      })
  }

  toggle() {
    this.logs = []

    const count = this.validateForm.get('count').value
    const groupName = this.validateForm.get('zone').value

    if (this.isData) {
      this.requestMockData(groupName)
    } else {
      this.togglePending(groupName, 0)

      for (let i = 0; i < count - 1; i++) {
        const delay = Math.random() * 3

        setTimeout(() => {
          this.togglePending(groupName, delay)
        }, delay * 1000)
      }
    }
  }

  togglePending(groupName: string, delay: number) {
    const timeout = this.validateForm.get('timeout').value * 1000
    const errorMessage = this.validateForm.get('errorMessage').value

    const delayLog = delay > 0 ? `After ${delay.toFixed(2)}s, ` : ''

    this.logs.push(`${delayLog} emit <span class="highlight">${groupName}</span> group a <span class="highlight">${timeout}s</span> task`)

    this.service.showGroup(groupName)

    setTimeout(() => {
      if (this.isError) {
        this.toggleDoneWithError(groupName, errorMessage)
      } else {
        this.toggleDone(groupName)
      }
    }, timeout)
  }

  toggleDone(groupName: string) {
    this.service.hideGroup(groupName)
  }

  toggleDoneWithError(groupName: string, error) {
    this.service.hideGroupError(groupName, error)
  }

  requestMockData(groupName: string) {
    this.logs.push(`emit <span class="highlight">${groupName}</span> group a request mock data task`)

    this.httpClient.withLoadingMask(groupName)
      .get('/assets/mock-data.json')
      .subscribe(e => {
        console.log(e)
      })
  }
}
