// https://github.com/jaywcjlove/react-hotkeys

import Hotkeys from 'react-hot-keys'
import React, { ReactElement } from 'react'
import { Custom } from '../constant'
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from '../store'
import { FormMode } from '../store/editor'

const hotkey = (props: Partial<Custom>): ReactElement => {
  const {
    setCanShow,
    editor,
    setId,
    setPId,
    setTitle,
    initContent,
    setMode,
    setLevel,
    setFocusTime,
    setReloadVal
  } = props
  const onKeyDown = (keyName: string) => {
    switch (keyName) {
      case 'option+e':
        return setCanShow()
      case 'option+k':
        return setFocusTime()
      case 'option+r':
        setReloadVal(+new Date())
        return
      case 'option+enter':
        return ''
      default: {
        // esc 保留数据
        const { canShow } = editor || {}
        if (canShow) {
          setCanShow()
          setId(undefined)
          setPId(undefined)
          setTitle('')
          initContent()
          setLevel(0)
          setMode(FormMode.Create)
        }
      }
    }
  }
  return (
    <Hotkeys keyName="option+e,option+r,option+k,option+enter,esc" onKeyDown={onKeyDown}></Hotkeys>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(hotkey)
