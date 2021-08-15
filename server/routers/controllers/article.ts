import { Response, Request } from 'express'
import { queryArticleList, createArticle, editArticle } from '../model/article'

export function getList(req: Request, res: Response): void {
  queryArticleList().then(data => {
    res.status(200).send({
      code: 0,
      data,
      msg: 'success'
    })
  })
}

const DEFAULT_FIELD = 'empty'

export async function create(req: Request, res: Response): Promise<void> {
  const { title = DEFAULT_FIELD, content = DEFAULT_FIELD } = req.body
  const params = {
    title,
    content,
    state: 1,
    pid: 0
  }
  let msg = 'success'
  try {
    await createArticle(params)
  } catch (e) {
    msg = JSON.stringify(e)
  }
  res.status(200).send({
    code: 0,
    msg
  })
}

export async function edit(req: Request, res: Response): Promise<void> {
  const { title = DEFAULT_FIELD, content = DEFAULT_FIELD, id } = req.body
  const params = {
    title,
    content,
    state: 1,
    pid: 0,
    id
  }
  let msg = 'success'
  try {
    await editArticle(params)
  } catch (e) {
    msg = JSON.stringify(e)
  }
  res.status(200).send({
    code: 0,
    msg
  })
}
