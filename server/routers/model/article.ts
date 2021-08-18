import articleOrm from '../../orm/article'

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
    where: params
  })
}

export const queryArticleList = (req: any): any => {
  const { pn: pageIndex, ps: pageSize, level } = req.query
  const queryWhere: any = {}
  if (level !== undefined) {
    queryWhere.level = +level
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

export const editArticle = (params: ArtItem): any => {
  const { id, ...data } = params || {}
  return articleOrm.update(data, {
    where: {
      id
    }
  })
}
