import Head from 'next/head'
// import { useState, useEffect } from 'react'
// import cx from 'classnames'
import { Timeline, Empty, Badge, Card, message } from 'antd'
import dynamic from 'next/dynamic'
import HotKey from './components/hotkey'
import React, { ReactElement, useEffect, useState, FC } from 'react'
import { baseUrl, Custom } from './constant'
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from './store'
import { formatDate } from './utils'

const Editor = dynamic(() => import('./components/editor'), { ssr: false })
const Tool = dynamic(() => import('./components/tool'), { ssr: false })
const { Item } = Timeline
const { Ribbon } = Badge

const Home: FC<Custom> = (props): ReactElement => {
  const { canShow } = props.editor || {}
  const [artList, setArtList] = useState([])

  useEffect(() => {
    if (canShow) return
    fetch(`${baseUrl}/api/v1/article/query_list`)
      .then(res => res.json())
      .then(
        r => {
          if (+r.code !== 0) return message.warning(r?.message)
          setArtList(r.data)
        },
        err => {
          console.log(err)
        }
      )
  }, [canShow])

  const t = formatDate(+new Date())

  return (
    <div className="novel-map">
      <Head>
        <title>Novel Map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="novel-map__main">
        {artList.length ? (
          <Timeline>
            {artList.map((_: any, k: number) => (
              <Item color="gray" key={k}>
                <Ribbon text={_.title} placement="start" color="#1890ff">
                  {/* title: ctime */}
                  <Card className="novel-map__main-card" title={_.mtime || t} size="small">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: _.content
                      }}
                    />
                    <Tool item={_} />
                  </Card>
                </Ribbon>
                <div className="first-child-line"></div>
                <Ribbon text="Hippies" placement="start" color="#69c0ff">
                  {/* title: ctime */}
                  <Card className="novel-map__main-card" title={_.mtime || t} size="small">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: _
                      }}
                    />
                    <Tool item={_} />
                  </Card>
                </Ribbon>
                <div className="second-child-line"></div>
                <Ribbon text="Hippies" placement="start" color="#bae7ff">
                  {/* title: ctime */}
                  <Card className="novel-map__main-card" title={_.mtime || t} size="small">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: _
                      }}
                    />
                    <Tool item={_} />
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
        <HotKey />
      </main>
      <footer />
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
