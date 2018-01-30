export interface LoadingMaskGroup {
  uuid: number,
  id: string,
  pending: number,
  done: number,
  isError: boolean,
  instances: number
}

export type LoadingMaskGroupMap = Map<string, LoadingMaskGroup>
