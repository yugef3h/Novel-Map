// https://github.com/jaywcjlove/react-hotkeys

import Hotkeys from 'react-hot-keys'
import React, { ReactElement } from 'react'
import { Custom } from '../constant'
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from '../store'
import { EditorState } from 'draft-js'

const hotkey = (props: Partial<Custom>): ReactElement => {
  const { setCanShow, editor, setId, setTitle, setEditor } = props
  const onKeyDown = (keyName: string) => {
    switch (keyName) {
      case 'option+e':
        return setCanShow()
      case 'option+enter':
        return ''
      default: {
        // esc 保留数据
        const { canShow } = editor || {}
        if (canShow) {
          setCanShow()
          setId(undefined)
          setTitle('')
          setEditor(EditorState.createEmpty())
        }
      }
    }
  }
  return <Hotkeys keyName="option+e,option+enter,esc" onKeyDown={onKeyDown}></Hotkeys>
}

export default connect(mapStateToProps, mapDispatchToProps)(hotkey)
