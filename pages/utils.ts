import dayjs from 'dayjs'

/**
 * 时间戳转换
 * @param t
 */
export const formatDate = (t: number) => dayjs(t).format('YYYY-MM-DD HH:mm:ss')

/**
 * 苹果设备
 */
export const isAppleDevice = () => /(mac|iphone|ipod|ipad)/i.test(navigator.platform)
