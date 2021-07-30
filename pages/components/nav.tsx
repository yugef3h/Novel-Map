import React, { FC } from 'react'
import { Menu } from 'antd'

const { SubMenu, ItemGroup, Item } = Menu

interface INav {
  position?: string
}

const Nav: FC<INav> = () => {
  const current = ''
  return (
    <Menu selectedKeys={[current]} mode="horizontal">
      <SubMenu key="SubMenu" title="Navigation Three - Submenu">
        <ItemGroup title="Item 1">
          <Item key="setting:1">Option 1</Item>
          <Item key="setting:2">Option 2</Item>
        </ItemGroup>
        <ItemGroup title="Item 2">
          <Item key="setting:3">Option 3</Item>
          <Item key="setting:4">Option 4</Item>
        </ItemGroup>
      </SubMenu>
    </Menu>
  )
}

export default Nav
