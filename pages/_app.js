import React from 'react'
import './css/global.scss'
import 'antd/dist/antd.css'
import './css/home.scss'

// 新创建的 `pages/_app.js` 文件中必须有此默认的导出（export）函数
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
