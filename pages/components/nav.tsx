import React, { FC, useEffect } from 'react'
import { SketchSquareFilled } from '@ant-design/icons'
import { Input, Typography, Tag } from 'antd'
import { mapStateToProps, mapDispatchToProps } from '../store/index'
import { Custom, options as labels } from '../constant'
import { connect } from 'react-redux'
import { tagsColor } from '../utils'
const { Paragraph, Text } = Typography
const { Search } = Input

const Nav: FC<Custom> = props => {
  const { setSearchVal } = props
  const { focusTime } = props.editor || {}
  const inputRef = React.useRef<any>(null)

  const searchProps = {
    style: { width: '100%' },
    ref: inputRef
  }

  const onSearch = (val: string) => {
    setSearchVal(val.trim())
  }

  const onClick = (e: any) => {
    console.log(e.target.innerHTML.trim())
  }

  useEffect(() => {
    inputRef.current!.focus({
      cursor: 'all'
    })
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
            Press <Text keyboard>Option</Text>+<Text keyboard>R</Text> to reset Search
          </Paragraph>
        </li>
        <li>
          <Paragraph>
            Press <Text keyboard>Option</Text>+<Text keyboard>E</Text> to edit Editor
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
          <Tag key={l} color={tagsColor(i)} onClick={onClick}>
            {l}
          </Tag>
        ))}
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
