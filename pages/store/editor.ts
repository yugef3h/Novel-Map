// action & reducer
import { Action } from '../constant'
import { EditorState } from 'draft-js'

export enum FormMode {
  Create = 1,
  Edit
}

export const FormModeMap = new Map([
  [FormMode.Create, '新建'],
  [FormMode.Edit, '编辑']
])
export interface EditorItem {
  canShow: boolean
  reloadVal: number | string
  mode: FormMode
  focusTime: number
  searchVal: string
  artItem: {
    id: number | undefined
    level: number
    title: string
    content: EditorState
    pid: number | undefined
  }
}

export const defaultState: EditorItem = {
  canShow: false,
  mode: FormMode.Create,
  reloadVal: +new Date(),
  focusTime: +new Date(),
  searchVal: '',
  artItem: {
    id: undefined,
    level: 0,
    title: '',
    content: EditorState.createEmpty(),
    pid: undefined
  }
}

export const actionType: { [p: string]: string } = {
  initContent: 'INIT_EDITOR',
  setContent: 'SET_EDITOR',
  setTitle: 'SET_TITLE',
  setCanShow: 'SET_CAN_SHOW',
  setId: 'SET_ID',
  setLevel: 'SET_LEVEL',
  setMode: 'SET_MODE',
  setPId: 'SET_PID',
  setReloadVal: 'SET_RELOAD_TIME',
  setFocusTime: 'SET_FOCUS_TIME',
  setSearchVal: 'SET_SEARCH_TIME'
}

const reducer = (state = defaultState, action: Action<any>): EditorItem => {
  switch (action.type) {
    case actionType.initContent:
      return Object.assign({}, state, {
        artItem: {
          ...state.artItem,
          content: EditorState.createEmpty()
        }
      })
    case actionType.setContent:
      return Object.assign({}, state, {
        artItem: {
          ...state.artItem,
          content: action.payload
        }
      })
    case actionType.setTitle: {
      return Object.assign({}, state, {
        artItem: {
          ...state.artItem,
          title: action.payload
        }
      })
    }
    case actionType.setCanShow:
      return Object.assign({}, state, {
        canShow: !state.canShow
      })
    case actionType.setId:
      return Object.assign({}, state, {
        artItem: {
          ...state.artItem,
          id: action.payload
        }
      })
    case actionType.setPId:
      return Object.assign({}, state, {
        artItem: {
          ...state.artItem,
          pid: action.payload
        }
      })
    case actionType.setLevel:
      return Object.assign({}, state, {
        artItem: {
          ...state.artItem,
          level: action.payload
        }
      })
    case actionType.setMode:
      return Object.assign({}, state, {
        mode: action.payload
      })
    case actionType.setReloadVal:
      return Object.assign({}, state, {
        reloadVal: action.payload
      })
    case actionType.setFocusTime:
      return Object.assign({}, state, {
        focusTime: +new Date()
      })
    case actionType.setSearchVal: {
      return Object.assign({}, state, {
        searchVal: action.payload
      })
    }
    default:
      return state
  }
}

export default reducer
