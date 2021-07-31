import React, { FC } from 'react'
import { Tooltip } from 'antd'
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
  SisternodeOutlined,
} from '@ant-design/icons'

const Tool: FC<any> = () => {
  return (
    <div className={'novel-map__tool'}>
      <span>
        <Tooltip placement="top" title={'编辑'}>
          <EditOutlined className={'novel-map__tool-icon'} />
        </Tooltip>
      </span>
      <span>
        <Tooltip placement="top" title={'插入节点'}>
          <PlusCircleOutlined className={'novel-map__tool-icon'} />
        </Tooltip>
      </span>
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

export default Tool
