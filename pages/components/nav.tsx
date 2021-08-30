import React, { FC, useEffect, MouseEvent, useState } from 'react'
import { SketchSquareFilled } from '@ant-design/icons'
import { Input, Typography, Tag, message } from 'antd'
import { mapStateToProps, mapDispatchToProps } from '../store/index'
import { Custom } from '../constant'
import { connect } from 'react-redux'
import { tagsColor } from '../utils'
const { Paragraph, Text } = Typography
const { Search } = Input

type NavProps = Partial<Custom> & {
  labels: string[]
}

const Nav: FC<NavProps> = props => {
  const { setSearchVal, labels, setReloadVal } = props
  const { focusTime } = props.editor || {}
  const inputRef = React.useRef<any>(null)
  const [history, setHistory] = useState([])

  const searchProps = {
    style: { width: '100%' },
    ref: inputRef
  }

  const onSearch = (val: string) => {
    const v = val.trim()
    if (v.length === 1) return message.warning('字符长度至少为 2，请重新输入')
    setSearchVal(val.trim())
  }

  const onClick = (e: MouseEvent<HTMLButtonElement | HTMLElement>, type: string) => {
    const label = (e.target as HTMLElement).innerText
    setReloadVal({
      [type]: label
    })
  }

  useEffect(() => {
    inputRef &&
      inputRef.current.focus({
        cursor: 'all'
      })

    const data = localStorage.getItem('lru_history')
    data && setHistory(JSON.parse(data))
  }, [focusTime])

  return (
    <div className="novel-map__nav">
      <h1>
        <SketchSquareFilled />
        &nbsp;&nbsp;Novel Map
      </h1>
      <Search {...searchProps} placeholder="Search..." allowClear onSearch={onSearch} />
      <br />
      <br />
      <ul>
        <li>
          <Paragraph>
            Press <Text keyboard>Option</Text>+<Text keyboard>K</Text> to focus Search
          </Paragraph>
        </li>
        <li>
          <Paragraph>
            Press <Text keyboard>Option</Text>+<Text keyboard>E</Text> to edit Editor
          </Paragraph>
        </li>
        <li>
          <Paragraph>
            Press <Text keyboard>Option</Text>+<Text keyboard>R</Text> to reset
          </Paragraph>
        </li>
        <li>
          <Paragraph>
            Press <Text keyboard>Esc</Text> to exit Editor
          </Paragraph>
        </li>
      </ul>
      <div className="novel-map__labels">
        {labels.map((l, i) => (
          <Tag key={l} color={tagsColor(i)} onClick={e => onClick(e, 'tag')}>
            {l}
          </Tag>
        ))}
      </div>
      <br />
      <div className="novel-map__last-edit">
        {history.map((l, i) => (
          <Tag key={l} color={tagsColor(i)} onClick={e => onClick(e, 'title')}>
            {l}
          </Tag>
        ))}
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
