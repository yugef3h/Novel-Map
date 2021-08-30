import articleOrm from '../../orm/article'
import { Op } from 'sequelize'
import { Request } from 'express'
import connection from '../../db'
import env from '../../config'

export interface ArtItem {
  id: number
  title: string
  content: string
  state?: number
  pid: number
  desc?: string
  cover?: string
  tags?: string
  level?: number
  extra?: string // 不对前端暴露
  children?: any[]
  mtime?: string
  ctime?: string
}

const artField = [
  'id',
  'content',
  'title',
  'cover',
  'tags',
  'level',
  'pid',
  'state',
  'desc',
  'ctime',
  'mtime',
  'extra'
]

export const queryArtChildren = (params: any): any => {
  return articleOrm.findAll({
    attributes: artField,
    where: {
      ...params,
      state: {
        [Op.not]: [-1]
      }
    }
  })
}

export const queryArticleList = (req: any): any => {
  const { pn: pageIndex, ps: pageSize, level, tag = '', title = '' } = req.query
  const queryWhere: any = {}
  if (level !== undefined) {
    queryWhere.level = +level
  }
  if (tag) {
    queryWhere.tags = {
      [Op.substring]: tag
    }
  }
  if (title) {
    queryWhere.title = {
      [Op.substring]: title
    }
  }
  queryWhere.state = {
    [Op.not]: [-1]
  }
  return articleOrm.findAndCountAll({
    attributes: artField,
    limit: +pageSize,
    offset: (+pageIndex - 1) * +pageSize,
    where: queryWhere
  })
}

export const createArticle = (params: Omit<ArtItem, 'id'>): any => {
  return articleOrm.create(params)
}

export const editArticle = (params: any): any => {
  const { id, ...data } = params || {}
  return articleOrm.update(data, {
    where: {
      id
    }
  })
}

export const delArticle = (params: any): any => {
  const { id, ...data } = params || {}
  return articleOrm.update(data, {
    where: {
      id
    }
  })
}

// https://cloud.tencent.com/developer/article/1686101 全文检索
export const queryFullText = (req: Request): any => {
  const { q, pn = 10, ps } = req.query
  const pageIndex = Number(pn) || 1
  const pageSize = Number(ps) || 10
  const offset = (pageIndex - 1) * pageSize
  const searchField = 'title,content,id,tags,state,level,pid'
  const matchField = 'content, title'
  const queryWhere = `MATCH (${matchField}) AGAINST ('${q}' IN BOOLEAN MODE) AND state not in (-1)`
  const sql = `select SQL_CALC_FOUND_ROWS ${searchField}, MATCH (${matchField}) AGAINST ('${q}') as score from art_page where ${queryWhere} limit ${pageSize} offset ${offset};SELECT FOUND_ROWS();`
  return connection.promise().query(sql)
}
