import dayjs from 'dayjs'
import { ArtItem } from '../server/routers/model/article'
import { cloneDeep } from 'lodash'

/**
 * 时间戳转换
 * @param t
 */
export const formatDate = (t: number): string => dayjs(t).format('YYYY-MM-DD HH:mm:ss')

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

/**
 * 卡片 tag 的颜色
 * @param level
 */
export const formatColor = (level: number): string => {
  const color = ['#1890ff', '#40a9ff', '#69c0ff'][level]
  return color || '#69c0ff'
}

export default {
  formatDate,
  isAppleDevice,
  formatTree,
  formatColor
}
