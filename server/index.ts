import next from 'next'
import bootstrap from './orm/bootstrap'
import app from './app'

process.on('unhandledRejection', (reason: Error | any, p: Promise<any>) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
})

const dev = process.env.NODE_ENV !== 'production'
const init = next({ dev, dir: './' })

init.prepare().then(() => {
  bootstrap()
    .then(() => {
      const server = app.listen(8081, () => {
        const { address, port }: any = server.address()
        console.info('\x1B[33m%s\x1B[0m', `[nodemon] server start in ip: ${address}, port: ${port}`)
      })
    })
    .catch((err: Error) => {
      console.log('err', err)
    })
})
