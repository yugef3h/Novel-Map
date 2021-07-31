import { NextApiHandler } from 'next'

const Hello: NextApiHandler = async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.write(JSON.stringify([{ name: '1' }, { name: '2' }]))
  res.end()
}

export default Hello
