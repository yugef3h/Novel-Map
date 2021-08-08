import articleOrm from '../../orm/article'

export const queryArticleList = (pid: number | number[]) => {
  return articleOrm.findAll({
    where: {
      pid
    }
  })
}