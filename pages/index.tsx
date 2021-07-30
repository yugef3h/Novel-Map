import Head from 'next/head'
// import { useState, useEffect } from 'react'
// import cx from 'classnames'
import { Timeline, Empty, Badge, Card } from 'antd'
import dynamic from 'next/dynamic'
import Tool from './components/tool'
// import {
//   ClockCircleOutlined,
//   CheckCircleFilled,
//   StarFilled,
// } from '@ant-design/icons'
import { formatDate } from './utils'
import React from 'react'

const Editor = dynamic(() => import('./components/editor'), { ssr: false })
const { Item } = Timeline
const { Ribbon } = Badge

const Home = () => {
  const arr = [1, 2, 3, 4]
  const mock = [...arr, ...arr, ...arr].map(i => 'Create a services site')
  // const mock: any = []
  return (
    <div className="novel-map">
      <Head>
        <title>Novel Map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="novel-map__main">
        {mock.length ? (
          <Timeline>
            {mock.map((_: string, k: number) => (
              <Item color="gray" key={k}>
                <Ribbon text="Hippies" placement="start">
                  {/* title: ctime */}
                  <Card
                    className="novel-map__main-card"
                    title={formatDate(+new Date())}
                    size="small"
                  >
                    {_}
                    <Tool />
                  </Card>
                </Ribbon>
              </Item>
            ))}
          </Timeline>
        ) : (
          <Empty
            className="novel-map__main-empty"
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
              height: 60,
            }}
            description={<span>我们的征途是星辰大海！</span>}
          />
        )}
        <div className="novel-map__main-info">
          <Editor />
        </div>
      </main>
      <footer />
    </div>
  )
}

export default Home