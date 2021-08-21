import { EditorItem } from './store/editor'

export const baseUrl = 'http://localhost:8081'

export interface Custom {
  editor?: Partial<EditorItem>
  setCanShow?: any
  setContent?: any
  initContent?: any
  setTitle?: any
  setLevel?: any
  setMode?: any
  setId?: any
  setPId?: any

  reloadTime?: number
  setReloadTime?: any

  focusTime?: number
  setFocusTime?: any

  searchVal?: string
  setSearchVal?: any
}

export interface Action<T> {
  type: string
  payload?: T
}

export const Constants = {
  PAGE_SIZE: 5,
  CHILDREN_COUNT: 10, // 同级子树的个数
  LEVEL_LIMIT: 3 // 逐级查找的层数
}
