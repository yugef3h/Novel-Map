import editor, { actionType as editorType } from './editor'
import { combineReducers, Dispatch, Store } from 'redux'

export const rootReducer = combineReducers({
  editor
})

export const mapStateToProps = (s: Store): Store => {
  return s
}

export const mapDispatchToProps = (dispatch: Dispatch): any => {
  const dispaters: {
    [m: string]: any
  } = {}
  Object.keys(editorType).forEach(e => {
    dispaters[e] = (payload: any) => dispatch({ type: editorType[e], payload })
  })
  return {
    ...dispaters
  }
}

export default {
  rootReducer,
  mapStateToProps,
  mapDispatchToProps
}
