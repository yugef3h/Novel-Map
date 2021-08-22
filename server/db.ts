import mysql from 'mysql2'
import Promise from 'bluebird'
import env from './config'
const { HOST, PORT, USER, PASSWORD, DATABASE } = env.CONFIG

export interface DbConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  multipleStatements?: boolean
}

const config: Partial<DbConfig> = {
  host: HOST,
  port: +(PORT || 3306),
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  multipleStatements: true
}

const conn = mysql.createConnection(config)

const connection = Promise.promisifyAll(conn)

export default connection
