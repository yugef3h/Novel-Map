import Head from 'next/head'
import cx from 'classnames'
import { Timeline, Empty, Badge, Card, message, Pagination, Spin, Tag } from 'antd'
import dynamic from 'next/dynamic'
import HotKey from './components/hotkey'
import React, { ReactElement, useEffect, useState, FC, useCallback } from 'react'
import { baseUrl, Custom, Constants } from './constant'
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from './store'
import { formatTree, formatColor, formatUtc } from './utils'
import { ArtItem } from '../server/routers/model/article'
import Nav from './components/nav'

const Editor = dynamic(() => import('./components/editor'), { ssr: false })
const Tool = dynamic(() => import('./components/tool'), { ssr: false })
const { Item } = Timeline
const { Ribbon } = Badge

const { PAGE_SIZE, CHILDREN_COUNT, LEVEL_LIMIT } = Constants

const Home: FC<Custom> = (props): ReactElement => {
  const { canShow, reloadVal, searchVal } = props.editor || {}
  const [artList, setArtList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [labels, setLabels] = useState<string[]>([])

  const fetchListByPage = useCallback(() => {
    setLoading(true)
    let where = ''
    if (reloadVal && typeof reloadVal !== 'number') {
      const { title, tag } = reloadVal || {}
      title && (where = `title=${title}&`)
      tag && (where = `tag=${tag}&`)
    }
    const novelQuery = `${where}level=0&level_limit=${LEVEL_LIMIT}`
    fetch(`${baseUrl}/api/v1/article/query_list?pn=${currentPage}&ps=${PAGE_SIZE}&${novelQuery}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    })
      .then(res => res.json())
      .then(
        r => {
          if (+r.code !== 0) return message.warning(r?.msg)
          const { list, count } = r.data || {}
          setArtList(formatTree(list) || [])
          setLoading(false)
          setTotal(count || 0)
        },
        err => {
          console.log(err?.msg)
        }
      )
  }, [currentPage, reloadVal])

  const fetchLabels = useCallback(() => {
    fetch(`${baseUrl}/api/v1/article/query_labels`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    })
      .then(res => res.json())
      .then(
        r => {
          if (+r.code !== 0) return message.warning(r?.msg)
          setLabels(r.data || [])
        },
        err => {
          console.log(err?.msg)
        }
      )
  }, [currentPage])

  const searchByPage = useCallback(() => {
    setLoading(true)
    fetch(`${baseUrl}/api/v1/article/search?q=${searchVal}&pn=${currentPage}&ps=${PAGE_SIZE}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    })
      .then(res => res.json())
      .then(
        r => {
          if (+r.code !== 0) return message.warning(r?.msg)
          setArtList(r.data?.[0] || [])
          setLoading(false)
          setTotal(r.data?.[1]?.[0]?.['FOUND_ROWS()'] || 0)
        },
        err => {
          console.log(err?.msg)
        }
      )
  }, [searchVal, currentPage])

  useEffect(() => {
    !searchVal ? fetchListByPage() : searchByPage()
  }, [searchVal, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchVal, reloadVal])

  useEffect(() => {
    fetchLabels()
  }, [])

  useEffect(() => {
    if (searchVal) return
    if (canShow) return
    fetchListByPage()
  }, [currentPage, canShow, reloadVal])

  const renderTags = (tags: string, mtime: string) => {
    if (!tags) return <span>{formatUtc(mtime)}</span>
    const tagsArr = tags.split(',')
    return (
      <>
        {tagsArr.length &&
          tagsArr.map((t: string, k: number) => (
            <Tag key={k} color="default">
              {t}
            </Tag>
          ))}
        <span>{formatUtc(mtime)}</span>
      </>
    )
  }

  const loop = (list: ArtItem[]) => {
    return list.map((_: ArtItem, k: number) => {
      const level = Number(_.level) || 0
      const children = _.children || []
      const id = _.id
      const tags = _.tags || ''
      const mtime = _.mtime || ''
      const showTool = children.length === 0 || children.length < CHILDREN_COUNT
      if (_.level === 0) {
        return (
          <Item color="gray" key={k}>
            <Ribbon text={`${id}. ${_.title}`} placement="start" color={formatColor(level)}>
              {/* title: ctime */}
              <Card className="novel-map__main-card" title={renderTags(tags, mtime)} size="small">
                <div
                  dangerouslySetInnerHTML={{
                    __html: _.content
                  }}
                />
                {showTool && <Tool item={_} labels={labels} />}
              </Card>
            </Ribbon>
            {_.children && loop(_.children)}
          </Item>
        )
      }
      return (
        <div className="child-tree" key={k}>
          <div
            className={cx('child-line', {
              'child-line-hidden': list[k - 1]?.children?.length
            })}
          ></div>
          <Ribbon text={`${id}. ${_.title}`} placement="start" color={formatColor(level)}>
            <Card className="novel-map__main-card" title={renderTags(tags, mtime)} size="small">
              <div
                dangerouslySetInnerHTML={{
                  __html: _.content
                }}
              />
              {showTool && <Tool item={_} labels={labels} />}
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
      <Nav labels={labels} />
      {loading ? (
        <Spin spinning />
      ) : (
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
            className="novel-map__pagination"
            simple
            current={currentPage}
            hideOnSinglePage={true}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={(n: number) => setCurrentPage(n)}
          />
          <div className="novel-map__main-info">
            <Editor />
          </div>
          <HotKey />
        </main>
      )}
      <footer className="novel-map__footer" />
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
