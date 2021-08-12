import articleOrm from '../../orm/article'

export const queryArticleList = (pid: number | number[]) => {
  return articleOrm.findAll({
    where: {
      pid
    }
  })
}

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
export const createArticle = (params: Omit<ArtItem, 'id'>) => {
  return articleOrm.create(params)
}
