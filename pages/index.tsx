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
import React, { ReactElement, useEffect, useState } from 'react'
import { baseUrl } from './constant'
import { connect } from 'react-redux'

const Editor = dynamic(() => import('./components/editor'), { ssr: false })
const { Item } = Timeline
const { Ribbon } = Badge

const Home = (): ReactElement => {
  const arr = [1, 2, 3]
  const mock = [...arr].map(() => 'Create a services site')
  const [t, setTime] = useState('')

  useEffect(() => {
    fetch(`${baseUrl}/api/v1/article/query_list`)
      .then(res => res.json())
      .then(
        result => {
          console.log(result)
        },
        err => {
          console.log(err)
        }
      )
    setTime(formatDate(+new Date()))
  }, [])

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
                <Ribbon text="Hippies" placement="start" color="#1890ff">
                  {/* title: ctime */}
                  <Card className="novel-map__main-card" title={t} size="small">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: _
                      }}
                    />
                    <Tool />
                  </Card>
                </Ribbon>
                <div className="first-child-line"></div>
                <Ribbon text="Hippies" placement="start" color="#69c0ff">
                  {/* title: ctime */}
                  <Card className="novel-map__main-card" title={t} size="small">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: _
                      }}
                    />
                    <Tool />
                  </Card>
                </Ribbon>
                <div className="second-child-line"></div>
                <Ribbon text="Hippies" placement="start" color="#bae7ff">
                  {/* title: ctime */}
                  <Card className="novel-map__main-card" title={t} size="small">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: _
                      }}
                    />
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
              height: 60
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

export default connect()(Home)
