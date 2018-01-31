import { LoadingMaskGroup } from '../model/mask'
import { LoadingStatus } from '../model/event'

export const logGroupStatus = function (group: LoadingMaskGroup, status: LoadingStatus) {
  console.group(`group %s is ${status}`, group.id)
  console.log(group)
  console.groupEnd()
}
