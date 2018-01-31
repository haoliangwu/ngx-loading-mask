export enum LoadingStatus {
  INIT = '__init__',
  PENDING = 'pending',
  DONE = 'done',
  ERROR = 'error'
}

export interface LoadingEvent {
  id: string,
  status: LoadingStatus,
  data?: any
}
