import React, { useState, useEffect, FC, ReactElement } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw, Modifier } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
// import htmlToDraft from 'html-to-draftjs'
import { Button, Input, message, Typography } from 'antd'
import { baseUrl } from '../constant'
// import styles from './Editor.module.css'
const { Paragraph, Text } = Typography

interface Custom {
  editorState?: EditorState
  onChange?: any
}

/**
 * 自定义 toolbar
 * @param param0
 */
const CustomOption: FC<Custom> = ({ editorState, onChange }): ReactElement => {
  const [title, setTitle] = useState('')
  if (!editorState) return <></>

  const addSubmitBtn = () => {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      '', // 添加在末尾
      editorState.getCurrentInlineStyle()
    )
    onChange(EditorState.push(editorState, contentState, 'insert-characters'))
    // result
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))?.trim()
    const curTitle = title.trim()
    if (!curTitle || content === '<p></p>') {
      message.warning('标题 or 内容不能为空！')
      return
    }
    fetch(`${baseUrl}/api/v1/article/create`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        title,
        content
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (+result.code !== 0) {
            message.error(JSON.stringify(result))
            return
          }
          message.success('段落添加成功！')
          setTitle('')
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
      <Paragraph className="novel-map__editor-shortcut">
        <Text keyboard>⌘ + enter</Text>
      </Paragraph>
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
const Draft = (): ReactElement => {
  const [iShow, setIshow] = useState(false)
  const [_eState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState)
  }

  useEffect(() => {
    setIshow(true)
  }, [])
  return (
    <>
      {iShow && (
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
          toolbarCustomButtons={[<CustomOption key={'submit'} />]}
          editorState={_eState}
          onEditorStateChange={onEditorStateChange}
        />
      )}
    </>
  )
}

export default Draft
