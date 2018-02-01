import { Injectable, Inject } from '@angular/core'
import { LoadingMaskGroupMap, LoadingMaskGroup } from './model/mask'

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { LoadingEvent, LoadingStatus } from './model/event'
import { Observable } from 'rxjs/Observable'
import { filter } from 'rxjs/operators'
import { Config } from './model/config'
import { CONFIG, DEFAULT_MASK_GROUP } from './config'

@Injectable()
export class LoadingMaskService {
  private isSnipPreload = false
  private uuid = 1
  private maskGroupMap: LoadingMaskGroupMap

  private loadingEvent$ = new BehaviorSubject<LoadingEvent>({
    id: '__init__',
    status: LoadingStatus.INIT
  })

  constructor(
    @Inject(CONFIG) private config: Config
  ) {
    this.bootstrap()
  }

  subscribe(groupName?: string): Observable<LoadingEvent> {
    if (!!groupName) {
      return this.loadingEvent$.pipe(
        filter(e => e.id === groupName)
      )
    } else {
      return this.loadingEvent$.asObservable()
    }
  }

  /*
   * register group instance
   */
  register(groupName: string = DEFAULT_MASK_GROUP, replace = false): LoadingMaskGroup {
    if (groupName.length === 0) {
      groupName = DEFAULT_MASK_GROUP
    }

    let group: LoadingMaskGroup

    if (this.isDefaultGroup(groupName)) {
      group = this.getGroup(groupName, true)
    } else {
      group = this.setGroup(groupName, replace)
    }

    return group
  }

  /*
   * unregister group instance
   */
  unregister(groupName: string): void {
    if (this.isDefaultGroup(groupName)) {
      throw new Error('cannot unregister default loading mask group')
    }

    if (!this.maskGroupMap.has(groupName)) {
      throw new Error('cannot unregister non-existed loading mask group')
    }

    const group = this.getGroup(groupName)

    group.instances--

    if (group.instances === 0) {
      this.maskGroupMap.delete(groupName)
    }
  }

  /*
   * if groupName is default group name
   */
  isDefaultGroup(groupName: string): boolean {
    return groupName === DEFAULT_MASK_GROUP
  }

  /*
   * if group has been done status
   */
  isDoneGroup(group: LoadingMaskGroup): boolean {
    return group.done === group.pending
  }

  /*
   * get group instance of groupName
   * if don't existed and safe = true, set new group instance with groupName and return it
   */
  getGroup(groupName: string, safe = false): LoadingMaskGroup {
    if (this.maskGroupMap.has(groupName)) {
      return this.maskGroupMap.get(groupName)
    } else {
      if (safe) {
        return this.setGroup(groupName)
      }
    }
  }

  /*
   * set group instance of groupName
   * if replace = false, will return exited group instance with corresponding groupName
   * otherwise, will replace current group instance with new one
   */
  setGroup(groupName: string, replace = false): LoadingMaskGroup {
    let group: LoadingMaskGroup

    if (!replace && this.maskGroupMap.has(groupName)) {
      group = this.getGroup(groupName)
    } else {
      group = this.maskGroupFactory(groupName)
      this.maskGroupMap.set(groupName, group)
    }

    group.instances++

    return group
  }

  showGroup(groupName: string = DEFAULT_MASK_GROUP) {
    this.loadingEvent$.next(this.loadingEventFactory(groupName, LoadingStatus.PENDING))
  }

  hideGroup(groupName: string = DEFAULT_MASK_GROUP) {
    this.loadingEvent$.next(this.loadingEventFactory(groupName, LoadingStatus.DONE))
  }

  hideGroupError(groupName: string = DEFAULT_MASK_GROUP, error: any) {
    this.loadingEvent$.next(this.loadingEventFactory(groupName, LoadingStatus.ERROR, error))
  }

  preloadImage() {
    if (this.isSnipPreload) return

    const { snippet: { imgUrl } } = this.config

    console.group('starting preload snip image from:', imgUrl)
    this.isSnipPreload = true

    const img: HTMLImageElement = new Image()
    img.src = imgUrl
    img.onload = () => {
      console.log('preloaded sucessfully')
      console.groupEnd()
      this.isSnipPreload = true
    }

    img.onerror = () => {
      console.log('preloaded met some error')
      console.groupEnd()
      this.isSnipPreload = false
    }
  }

  private bootstrap(): void {
    this.maskGroupMap = new Map()
    this.setGroup(DEFAULT_MASK_GROUP, true)
  }

  private loadingEventFactory(groupName: string, status: LoadingStatus, data?: any): LoadingEvent {
    return {
      id: groupName,
      status,
      data
    }
  }

  private maskGroupFactory(groupName: string): LoadingMaskGroup {
    return {
      uuid: this.uuid++,
      id: groupName,
      pending: 0,
      done: 0,
      isError: false,
      instances: 0
    }
  }
}
