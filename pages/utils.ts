import dayjs from 'dayjs'
import { ArtItem } from '../server/routers/model/article'
import { cloneDeep } from 'lodash'
import moment from 'moment'

/**
 * 时间戳转换
 * @param t
 */
export const formatDate = (t: number): string => dayjs(t).format('YYYY-MM-DD HH:mm:ss')

export const formatUtc = (t: string): string => moment(t).format('YYYY-MM-DD HH:mm:ss')

/**
 * 苹果设备
 */
export const isAppleDevice = (): boolean => /(mac|iphone|ipod|ipad)/i.test(navigator.platform)

/**
 * 转换 article 数据
 * @param res
 */
export const formatTree = (res: any[]): any => {
  let cur = res.shift()
  const next = res.shift()
  if (!next || !next.length) return cur
  const tree: {
    [id: string]: ArtItem[]
  } = {}
  for (const n of next) {
    const val = tree[n.pid]
    tree[n.pid] = val ? [...val, n] : [n]
  }
  cur = cur.map((c: ArtItem) => ({
    ...c,
    children: (tree[c.id] && formatTree([tree[c.id], ...cloneDeep(res)])) || []
  }))
  return cur
}

export const formatColor = (level: number): string => {
  const color = ['#1890ff', '#40a9ff', '#69c0ff'][level]
  return color || '#69c0ff'
}

export const tagsColor = (i: number): string => {
  const colorArr = [
    '#f5222d',
    '#ff7a45',
    '#fa8c16',
    '#ffc53d',
    '#52c41a',
    '#40a9ff',
    '#2f54eb',
    '#722ed1',
    '#ff85c0',
    '#8c8c8c'
  ]
  return colorArr[i >= colorArr.length ? i % colorArr.length : i]
}

export default {
  formatDate,
  isAppleDevice,
  formatTree,
  formatColor,
  tagsColor
}
