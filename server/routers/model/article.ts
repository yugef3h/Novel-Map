import articleOrm from '../../orm/article'

interface ArtItem {
  id: number
  title: string
  content: string
  state: number
  pid: number
  desc?: string
  cover?: string
  tags?: string
}

export const queryArticleList = (params?: { level: number }): Promise<articleOrm[]> => {
  return articleOrm.findAll({
    where: {
      level: params?.level || 0
    }
  })
}

export const createArticle = (params: Omit<ArtItem, 'id'>): Promise<any> => {
  return articleOrm.create(params)
}

export const editArticle = (params: ArtItem): Promise<any> => {
  const { id, ...data } = params
  return articleOrm.update(data, {
    where: {
      id
    }
  })
}
