
import { Logger } from 'winston';
const next = require('next')

process.on('unhandledRejection', (reason: Error | any, p: Promise<any>) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

const dev = process.env.NODE_ENV !== 'production'
const init = next({ dev, dir: './' })
const bootstrap = require('./orm/bootstrap').default;
const app = require('./app').default;

init.prepare().then(() => {
  bootstrap()
    .then(() => {
      const server = app.listen(3000, () => {
        const { address, port } = server.address();
        console.info('\x1B[33m%s\x1B[0m', `[nodemon] server start in ip: ${address}, port: ${port}`)
      });
    })
    .catch((err: Error) => {
      console.log('err', err)
    });
})