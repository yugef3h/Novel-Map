import React, { FC, ReactElement, useMemo, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw, Modifier } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Button, Input, message, Tag } from 'antd'
import { baseUrl, Custom } from '../constant'
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from '../store'
import { FormModeMap, FormMode } from '../store/editor'

const maxCapacity = 6

/**
 * 自定义 toolbar
 * @param param0
 */
export const CustomOption: FC<any> = (props): ReactElement => {
  const { onChange, editorState, childProps } = props
  const {
    initContent,
    setCanShow,
    setTitle,
    editor,
    setId,
    setPId,
    setLevel,
    setMode,
    setFocusTime
  } = childProps
  const { mode = FormMode.Create, artItem, canShow } = editor || {}
  const { title = '', id, level = 0, pid } = artItem || {}
  const modeText = useMemo(() => FormModeMap.get(mode), [mode])

  // 移除浏览器默认的 tab 事件
  const onKeyDown = (e: any): void => {
    if (e.which === 9) {
      e.preventDefault()
    }
    if (e.which === 9 && canShow) {
      const curContent = editorState.getCurrentContent()
      const contentState = Modifier.replaceText(
        curContent,
        editorState.getSelection(),
        '　　嗨', // 添加在末尾
        editorState.getCurrentInlineStyle()
      )
      onChange(EditorState.push(editorState, contentState, 'insert-characters'))
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  if (!editorState) return <></>

  const setLRUCache = (t: string) => {
    const data = localStorage.getItem('lru_history') || '[]'
    if (data === '[]') {
      localStorage.setItem('lru_history', JSON.stringify([title]))
      setFocusTime()
      return
    }
    if (data.indexOf(t) !== -1) return
    const lruHistory = JSON.parse(data)
    const l = lruHistory.length
    if (l >= maxCapacity) lruHistory.shift()
    lruHistory.push(t)
    localStorage.setItem('lru_history', JSON.stringify(lruHistory))
    setFocusTime()
  }

  const addSubmitBtn = () => {
    const curContent = editorState.getCurrentContent()
    const contentState = Modifier.replaceText(
      curContent,
      editorState.getSelection(),
      '', // 添加在末尾
      editorState.getCurrentInlineStyle()
    )
    onChange(EditorState.push(editorState, contentState, 'insert-characters'))
    // result
    const html = draftToHtml(convertToRaw(curContent))?.trim()
    const curTitle = title.trim()
    if (!curTitle || html === '<p></p>') return message.warning('标题 or 内容不能为空！')
    if (curTitle.length > 15) return message.warning('标题超过 15 个字符！')
    const url = id ? `${baseUrl}/api/v1/article/edit` : `${baseUrl}/api/v1/article/create`
    const data = id
      ? {
          title: curTitle,
          content: html,
          id
        }
      : {
          title: curTitle,
          content: html,
          pid,
          level
        }
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (+result.code !== 0) return message.error(JSON.stringify(result))
          message.success('段落添加成功！')
          setCanShow()
          setTitle('')
          initContent()
          setId(undefined)
          setPId(undefined)
          setLevel(0)
          setMode(FormMode.Create)
          setLRUCache(title)
        },
        err => {
          message.error(JSON.stringify(err))
        }
      )
  }

  const getValue = (e: React.FormEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  return (
    <>
      <div className="novel-map__editor-tags">
        <Tag color="blue">{modeText}中</Tag>
        {id && <Tag color="magenta">当前 Id: {id}</Tag>}
        {level > 0 && <Tag color="magenta">当前有挂名 Id: {pid}</Tag>}
      </div>
      <div className="novel-map__editor-custom" onClick={addSubmitBtn}>
        <Button type="primary" shape="round">
          Submit
        </Button>
      </div>
      <Input
        value={title}
        placeholder="Title..."
        size="large"
        bordered={false}
        onChange={getValue}
      />
    </>
  )
}

/**
 * draft 编辑器
 * func 清空，赋值，提交，focus
 */
const Draft: FC<Partial<Custom>> = (props): ReactElement => {
  const { editor, setContent } = props
  const { canShow, artItem } = editor || {}
  const { content } = artItem || {}
  const onEditorStateChange = (editorState: EditorState) => {
    setContent(editorState)
  }

  return (
    <>
      {canShow && (
        <Editor
          wrapperClassName="novel-map__editor-wrapper"
          editorClassName="novel-map__editor-content"
          toolbar={{
            blockType: {
              inDropdown: true,
              options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
              className: undefined,
              component: undefined,
              dropdownClassName: undefined
            }
          }}
          toolbarCustomButtons={[<CustomOption key={'submit'} childProps={props} />]}
          editorState={content}
          onEditorStateChange={onEditorStateChange}
        />
      )}
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Draft)
