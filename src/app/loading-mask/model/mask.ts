import { DomPortalHost } from '@angular/cdk/portal'

export interface LoadingMaskGroup {
  uuid: number,
  id: string,
  pending: number,
  done: number,
  isError: boolean,
  instances: number,
  el?: HTMLElement,
  host?: DomPortalHost
}

export type LoadingMaskGroupMap = Map<string, LoadingMaskGroup>
