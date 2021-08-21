import React, { FC, useState, useCallback, useMemo } from 'react'
import { Tooltip, Select, Popover, message, Popconfirm } from 'antd'
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
import { Custom, baseUrl, Constants, options } from '../constant'
import { FormMode } from '../store/editor'
import { debounce } from 'lodash'
const { Option } = Select
const { LEVEL_LIMIT } = Constants

type ToolProps = Partial<Custom & { item: ArtItem }>

const Tool: FC<ToolProps> = props => {
  const {
    setCanShow,
    editor,
    setTitle,
    item,
    setContent,
    setId,
    setPId,
    setLevel,
    setMode,
    setReloadTime
  } = props
  const { canShow } = editor || {}
  const { content: serverContent, title, id, level = 0, tags, children } = item || {}
  const currentLabel = useMemo(() => tags?.split(','), [tags])
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
    if (level >= LEVEL_LIMIT) {
      message.warning(`子节点无法添加，限制 ${LEVEL_LIMIT} 级！`)
      return
    }
    setMode(FormMode.Create)
    setCanShow()
    setLevel(+level + 1)
    setPId(id)
  }

  const handleChange = (value: string[]) => {
    const label = value.filter(v => v)
    fetch(`${baseUrl}/api/v1/article/edit`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        id,
        tags: label.join(',')
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (+result.code !== 0) return message.error(JSON.stringify(result))
          message.success('标签修改成功！')
          setReloadTime()
        },
        err => {
          message.error(JSON.stringify(err))
        }
      )
  }

  const deleteArticle = () => {
    fetch(`${baseUrl}/api/v1/article/delete`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        id,
        state: -1
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (+result.code !== 0) return message.error(JSON.stringify(result))
          message.success('删除成功！')
          setReloadTime()
        },
        err => {
          message.error(JSON.stringify(err))
        }
      )
  }

  const onChange = useCallback(
    debounce(e => handleChange(e), 2000),
    []
  )

  const content = () => {
    const opts = options.map(o => (
      <Option key={o} value={o}>
        {o}
      </Option>
    ))
    if (tags) {
      return (
        <Select
          mode="multiple"
          placeholder="Please select"
          defaultValue={currentLabel}
          onChange={onChange}
          style={{ width: '240px' }}
        >
          {opts}
        </Select>
      )
    }
    return (
      <Select
        mode="multiple"
        placeholder="Please select"
        onChange={onChange}
        style={{ width: '240px' }}
      >
        {opts}
      </Select>
    )
  }

  return (
    <div className={toolCx}>
      <span>
        <Tooltip placement="top" title={'编辑'}>
          <EditOutlined className={'novel-map__tool-icon'} onClick={edit} />
        </Tooltip>
      </span>
      <span>
        <Tooltip placement="top" title={'插入子节点'}>
          <SisternodeOutlined className={'novel-map__tool-icon'} onClick={appendChild} />
        </Tooltip>
      </span>
      <span>
        <Popover content={content} title={`${id}. ${tags ? '编辑' : '添加'}标签`}>
          <TagOutlined className={'novel-map__tool-icon'} />
        </Popover>
      </span>
      {(!children || (children && !children.length)) && (
        <span>
          <Popconfirm
            title="Are you sure to delete this article?"
            onConfirm={deleteArticle}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip placement="top" title={'删除'}>
              <DeleteOutlined className={'novel-map__tool-icon'} />
            </Tooltip>
          </Popconfirm>
        </span>
      )}
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Tool)
