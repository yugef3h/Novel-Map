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

export const options = [
  '校园',
  '战斗',
  '人物描写',
  '金句',
  '梗',
  '爽点',
  '土味撩人',
  '设定',
  '段子',
  '佳作',
  '起承转合'
]
