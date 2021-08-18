import Head from 'next/head'
// import cx from 'classnames'
import { Timeline, Empty, Badge, Card, message, Pagination } from 'antd'
import dynamic from 'next/dynamic'
import HotKey from './components/hotkey'
import React, { ReactElement, useEffect, useState, FC, useCallback } from 'react'
import { baseUrl, Custom } from './constant'
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from './store'
import { formatTree, formatColor } from './utils'
import { ArtItem } from '../server/routers/model/article'

const Editor = dynamic(() => import('./components/editor'), { ssr: false })
const Tool = dynamic(() => import('./components/tool'), { ssr: false })
const { Item } = Timeline
const { Ribbon } = Badge

const PAGE_SIZE = 10
const CHILD_LIMIT = 10
const TREE_LIMIT = 3

const Home: FC<Custom> = (props): ReactElement => {
  const { canShow } = props.editor || {}
  const [artList, setArtList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchListByPage = useCallback(() => {
    const novelQuery = `level=0&tree_limit=${TREE_LIMIT}`
    fetch(`${baseUrl}/api/v1/article/query_list?pn=${currentPage}&ps=${PAGE_SIZE}&${novelQuery}`)
      .then(res => res.json())
      .then(
        r => {
          if (+r.code !== 0) return message.warning(r?.msg)
          const { list, tree, count } = r.data || {}
          setArtList(formatTree(list, tree) || [])
          setTotal(count || 0)
        },
        err => {
          console.log(err?.msg)
        }
      )
  }, [currentPage])

  useEffect(() => {
    if (canShow) return
    fetchListByPage()
  }, [currentPage])

  const loop = (list: ArtItem[]): any => {
    return list.map((_: ArtItem, k: number) => {
      const level = Number(_.level) || 0
      const children = _.children || []
      const showTool = children.length === 0 || children.length < CHILD_LIMIT
      if (_.level === 0) {
        return (
          <Item color="gray" key={k}>
            <Ribbon text={_.title} placement="start" color={formatColor(level)}>
              {/* title: ctime */}
              <Card className="novel-map__main-card" title={_.mtime} size="small">
                <div
                  dangerouslySetInnerHTML={{
                    __html: _.content
                  }}
                />
                {showTool && <Tool item={_} />}
              </Card>
            </Ribbon>
            {_.children && loop(_.children)}
          </Item>
        )
      }
      return (
        <div className={`child-tree-${level}`} key={k}>
          <div className="child-line"></div>
          <Ribbon text={_.title} placement="start" color={formatColor(level)}>
            <Card className="novel-map__main-card" title={_.mtime} size="small">
              <div
                dangerouslySetInnerHTML={{
                  __html: _.content
                }}
              />
              {showTool && level < TREE_LIMIT && <Tool item={_} />}
            </Card>
          </Ribbon>
          {_.children && loop(_.children)}
        </div>
      )
    })
  }

  return (
    <div className="novel-map">
      <Head>
        <title>Novel Map</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="novel-map__main">
        {artList.length ? (
          <Timeline>{loop(artList)}</Timeline>
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
        <Pagination
          simple
          current={currentPage}
          total={total}
          pageSize={PAGE_SIZE}
          onChange={(n: number) => setCurrentPage(n)}
        />
        <div className="novel-map__main-info">
          <Editor />
        </div>
        <HotKey />
      </main>
      <footer className="novel-map__footer" />
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
