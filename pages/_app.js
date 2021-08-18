import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './store'
import './css/global.scss'
import 'antd/dist/antd.css'
import './css/home.scss'

const store = createStore(rootReducer)

// 新创建的 `pages/_app.js` 文件中必须有此默认的导出（export）函数
/* eslint-disable */
export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
