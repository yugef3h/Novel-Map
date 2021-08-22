import { Sequelize } from 'sequelize'
import { init as initArtPageModel } from './article'
import env from '../config'
const { HOST, PORT, USER, PASSWORD, DATABASE } = env.CONFIG

export interface DbConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
}

type Ins = {
  [prop: string]: Sequelize
}

export const instances: Ins = {}

const defaultResource = 'article'

async function getDB(resource = defaultResource): Promise<Sequelize> {
  if (instances[resource]) return instances[resource]
  const conf: Partial<DbConfig> = {
    host: HOST,
    port: +(PORT || 3306),
    user: USER,
    password: PASSWORD,
    database: DATABASE
  }
  const orm = new Sequelize({
    dialect: 'mysql',
    host: conf.host,
    port: conf.port,
    username: conf.user,
    password: conf.password,
    database: conf.database,
    logging: () => null
  })
  instances[resource] = orm
  if (resource === defaultResource) {
    initArtPageModel(orm)
  }
  return orm
}

export default function bootstrap(): Promise<Sequelize[]> {
  return Promise.all([getDB(defaultResource)])
}
