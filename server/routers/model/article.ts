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
  'mtime'
]

export const queryArticleList = (params?: { level: number }): any => {
  return articleOrm.findAll({
    attributes: artField,
    where: {
      level: params?.level || 0
    }
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
