import { Sequelize } from 'sequelize';
import { init as initArtPageModel } from './article'

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

type Ins = {
  [prop: string]: any
}

export const instances: Ins = {
  article: undefined,
};

const defaultResource = 'article'

async function getDB(resource = defaultResource): Promise<Sequelize> {
  if (instances[resource]) {
    return instances[resource];
  }
  const conf: DbConfig = {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Qing123.',
    database: 'novel_map'
  }
  const orm = new Sequelize({
    dialect: 'mysql',
    host: conf.host,
    port: conf.port,
    username: conf.user,
    password: conf.password,
    database: conf.database,
    logging: () => null,
  });
  instances[resource] = orm;
  if (resource === defaultResource) {
    initArtPageModel(orm);
  }
  return orm;
}

export default function bootstrap() {
  return Promise.all([getDB(defaultResource)]);
}