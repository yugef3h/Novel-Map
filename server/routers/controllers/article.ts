import { Response, Request } from 'express'
import { queryArticleList, createArticle } from '../model/article'

export function getList(req: Request, res: Response): void {
  queryArticleList(0).then(data => {
    res.status(200).send({
      code: 0,
      data,
      msg: 'success'
    })
  })
}

const DEFAULT_FIELD = 'empty'

export async function create(req: Request, res: Response) {
  const { title = DEFAULT_FIELD, content = DEFAULT_FIELD } = req.body
  const params = {
    title,
    content,
    state: 1,
    pid: 0
  }
  await createArticle(params)
  res.status(200).send({
    code: 0,
    msg: 'success'
  })
}
