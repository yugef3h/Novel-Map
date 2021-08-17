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
import { ArtItem } from '../../server/routers/model/article'
import { Custom } from '../constant'
import { FormMode } from '../store/editor'

type ToolProps = Partial<Custom & { item: ArtItem }>

const Tool: FC<ToolProps> = props => {
  const { setCanShow, editor, setTitle, item, setContent, setId, setPId, setLevel, setMode } = props
  const { canShow } = editor || {}
  const { content: serverContent, title, id, level = 0 } = item || {}
  const toolCx = cx('novel-map__tool', {
    'tool-hidden': canShow
  })

  const edit = () => {
    setMode(FormMode.Edit)
    setCanShow()
    setTitle(title)
    setId(id)
    if (!serverContent) return
    const contentBlock = htmlToDraft(serverContent)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      setContent(editorState)
    }
  }

  const appendChild = () => {
    setMode(FormMode.Create)
    setCanShow()
    setLevel(+level + 1)
    setPId(id)
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
          <SisternodeOutlined className={'novel-map__tool-icon'} onClick={appendChild} />
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
