import React, { useState, useEffect, FC, useCallback, Component, ReactElement } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw, Modifier } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { CheckOutlined } from '@ant-design/icons'
import { Button, Radio, Typography } from 'antd'

const { Title, Paragraph, Text, Link } = Typography

interface Custom {
  editorState?: EditorState
  onChange?: any
}

/**
 * 自定义 toolbar
 * @param param0
 */
const CustomOption: FC<Custom> = ({ editorState, onChange }): ReactElement => {
  if (!editorState) return <></>

  const addSubmitBtn = () => {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      '', // 添加在末尾
      editorState.getCurrentInlineStyle(),
    )
    onChange(EditorState.push(editorState, contentState, 'insert-characters'))
    // result
    console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  return (
    <>
      <Paragraph className="novel-map__editor-shortcut">
        <Text keyboard>⌘</Text>
        <Text keyboard>E</Text>
      </Paragraph>
      <div className="novel-map__editor-custom" onClick={addSubmitBtn}>
        <Button type="primary" shape="round" icon={<CheckOutlined />}>
          Submit
        </Button>
      </div>
    </>
  )
}

/**
 * draft 编辑器
 * func 清空，赋值，提交，focus
 */
const Draft: FC<any> = () => {
  const [iShow, setIshow] = useState(false)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState)
  }

  useEffect(() => {
    setIshow(false)
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
              dropdownClassName: undefined,
            },
          }}
          toolbarCustomButtons={[<CustomOption />]}
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
        />
      )}
    </>
  )
}

export default Draft
