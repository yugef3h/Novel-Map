import dayjs from 'dayjs'
import { ArtItem } from '../server/routers/model/article'

/**
 * 时间戳转换
 * @param t
 */
export const formatDate = (t: number): string => dayjs(t).format('YYYY-MM-DD HH:mm:ss')

/**
 * 苹果设备
 */
export const isAppleDevice = (): boolean => /(mac|iphone|ipod|ipad)/i.test(navigator.platform)

export const formatTree = (res: ArtItem[], btree: any): any => {
  if (!res || !btree) return []
  const tree: any = {}
  for (const r of btree) {
    if ((r as any[]).length) {
      const { pid } = (r as any[])[0]
      tree[pid] = r
    }
  }
  return res.map((r: ArtItem) => {
    const { id } = r || {}
    return {
      ...r,
      children: tree[id] || []
    }
  })
}

export const formatColor = (level: number): string =>
  ['#1890ff', '#40a9ff', '#69c0ff', '#91d5ff', '#bae7ff', '#e6f7ff'][level]

export default {
  formatDate,
  isAppleDevice,
  formatTree,
  formatColor
}
