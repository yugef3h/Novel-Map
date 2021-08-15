import React, { FC } from 'react'
import { Tooltip } from 'antd'
import cx from 'classnames'
import { mapStateToProps, mapDispatchToProps } from '../store'
import { connect } from 'react-redux'
import { EditorState, ContentState } from 'draft-js'
import {
  // PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
  SisternodeOutlined
} from '@ant-design/icons'
import htmlToDraft from 'html-to-draftjs'

const Tool: FC<any> = props => {
  const { setCanShow, editor, setTitle, item, setEditor, setId } = props
  const { canShow } = editor || {}
  const { content: serverContent, title, id } = item
  const toolCx = cx('novel-map__tool', {
    'tool-hidden': canShow
  })

  const edit = () => {
    setCanShow()
    setTitle(title)
    setId(id)
    const contentBlock = htmlToDraft(serverContent)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      setEditor(editorState)
    }
  }

  return (
    <div className={toolCx}>
      <span>
        <Tooltip placement="top" title={'编辑'}>
          <EditOutlined className={'novel-map__tool-icon'} onClick={edit} />
        </Tooltip>
      </span>
      {/* <span>
        <Tooltip placement="top" title={'插入节点'}>
          <PlusCircleOutlined className={'novel-map__tool-icon'} />
        </Tooltip>
      </span> */}
      <span>
        <Tooltip placement="top" title={'插入子节点'}>
          <SisternodeOutlined className={'novel-map__tool-icon'} />
        </Tooltip>
      </span>
      <span>
        <Tooltip placement="top" title={'标签'}>
          <TagOutlined className={'novel-map__tool-icon'} />
        </Tooltip>
      </span>
      <span>
        <Tooltip placement="top" title={'删除'}>
          <DeleteOutlined className={'novel-map__tool-icon'} />
        </Tooltip>
      </span>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Tool)
