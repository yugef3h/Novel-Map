import React, { FC, ReactElement } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw, Modifier } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Button, Input, message, Typography } from 'antd'
import { baseUrl, Custom } from '../constant'
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from '../store'

const { Paragraph, Text } = Typography

/**
 * 自定义 toolbar
 * @param param0
 */
export const CustomOption: FC<any> = (props): ReactElement => {
  const { onChange, editorState, childProps } = props
  const { initEditor, setCanShow, setTitle, editor } = childProps
  const { title = '', id } = editor || {}
  if (!editorState) return <></>

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
    if (!curTitle || html === '<p></p>') {
      message.warning('标题 or 内容不能为空！')
      return
    }
    const url = id ? `${baseUrl}/api/v1/article/edit` : `${baseUrl}/api/v1/article/create`
    const data = id
      ? {
          title,
          content: html,
          id
        }
      : {
          title,
          content: html
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
          initEditor()
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
const Draft: FC<Partial<Custom>> = (props): ReactElement => {
  const { editor, setEditor } = props
  const { canShow, content } = editor || {}
  const onEditorStateChange = (editorState: EditorState) => {
    setEditor(editorState)
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
