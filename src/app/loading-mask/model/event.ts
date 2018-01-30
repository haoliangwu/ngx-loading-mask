export enum LoadingStatus {
  INIT,
  PENDING,
  DONE,
  ERROR
}

export interface LoadingEvent {
  id: string,
  status: LoadingStatus,
  data?: any
}
