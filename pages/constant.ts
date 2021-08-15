import { EditorItem } from './store/editor'

export const baseUrl = 'http://localhost:8081'

export interface Custom {
  editor?: Partial<EditorItem>
  setCanShow?: any
  setEditor?: any
  initEditor?: any
  setTitle?: any
  id?: number
  setId: any
}

export interface Action<T> {
  type: string
  payload?: T
}
