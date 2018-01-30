import { Injectable } from '@angular/core'
import { LoadingMaskGroupMap, LoadingMaskGroup } from './model/mask'

@Injectable()
export class LoadingMaskService {
  private uuid = 1
  private maskGroupMap: LoadingMaskGroupMap

  constructor() {
    this.bootstrap()
  }

  /*
   * register group instance
   */
  register(groupName: string = 'default_mask_group', replace = false): LoadingMaskGroup {
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
    return groupName === 'default_mask_group'
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

  private bootstrap(): void {
    this.maskGroupMap = new Map()
    this.setGroup('default_mask_group', true)
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
