import { EditorItem } from './store/editor'

export const baseUrl = 'http://localhost:8081'

export interface Custom {
  editor?: Partial<EditorItem>
  reload?: boolean
  setCanShow?: any
  setContent?: any
  initContent?: any
  setTitle?: any
  setLevel?: any
  setMode?: any
  setId?: any
  setPId?: any
  setReload?: any
}

export interface Action<T> {
  type: string
  payload?: T
}
