import React, { FC } from 'react'
import { SketchSquareFilled } from '@ant-design/icons'
import { Input, Typography } from 'antd'
const { Paragraph, Text } = Typography

const Nav: FC<any> = () => {
  return (
    <div className="novel-map__nav">
      <h1>
        <SketchSquareFilled />
        &nbsp;&nbsp;Novel Map
      </h1>
      <Input placeholder="Search..." allowClear bordered={false} />
      <br />
      <br />
      <ul>
        <li>
          <Paragraph>
            Press <Text keyboard>⌘</Text>+<Text keyboard>K</Text> to search...
          </Paragraph>
        </li>
        <li>
          <Paragraph>
            Press <Text keyboard>Option</Text>+<Text keyboard>E</Text> to edit...
          </Paragraph>
        </li>
        <li>
          <Paragraph>
            Press <Text keyboard>Esc</Text> to exit...
          </Paragraph>
        </li>
      </ul>
    </div>
  )
}

export default Nav
