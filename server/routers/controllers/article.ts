import { Response, Request } from 'express';
import { queryArticleList } from '../model/article'

export async function getList(req: Request, res: Response) {
  queryArticleList(0).then(data => {
    console.log(data)
    res.status(200).send({
      code: 0,
      data,
      msg: 'success'
    });
  })

}