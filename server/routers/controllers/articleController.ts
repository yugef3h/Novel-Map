import { Response, Request } from 'express'
import {
  queryArticleList,
  createArticle,
  editArticle,
  queryArtChildren,
  ArtItem,
  queryFullText
} from '../model/article'
import env from '../../config'

const getTrees = async (list: ArtItem[], levelLimit: number, res: any[] = []) => {
  if (levelLimit-- === 0) return
  const promises = list.map(r => {
    const { level = 0, extra = '', id } = r || {}
    if (!extra) return Promise.resolve([])
    if (JSON.parse(extra)?.haveChild || false) return Promise.resolve([])
    return queryArtChildren({
      level: Number(level) + 1,
      pid: id
    })
  })
  const result = await Promise.all(promises)
  const flatResult = result.reduce((p, n) => {
    if (!n.length) return p
    return [...p, ...n]
  }, [])
  res.push(flatResult)
  await getTrees(flatResult, levelLimit, res)
}

export function getList(req: Request, res: Response): void {
  const { pn: pageIndex = 1, ps: pageSize = 10 } = req.query
  // queryArticleList -> Model.findAndCountAll
  // queryArtChildren -> Model.findAll
  queryArticleList(req).then(async (data: any) => {
    const result: any[] = [data.rows]
    const levelLimit = Number(req.query?.level_limit || '3')
    await getTrees(data.rows, levelLimit, result)

    res.status(200).send({
      code: 0,
      data: {
        list: result || [],
        pageIndex: +pageIndex,
        pageSize: +pageSize,
        count: data.count
      },
      msg: 'success'
    })
  })
}

type ExtraInfo = {
  id: number
  extra: {
    haveChild: boolean
  }
}

const queryArtById = queryArtChildren

async function updateExtraInfo(params: Partial<ExtraInfo>) {
  const { id, extra: newExtra } = params
  let msg = 'updateExtraInfo:success'
  try {
    const data = await queryArtById({
      id
    })
    const res = JSON.parse(JSON.stringify(data))
    const { extra } = res?.[0] || {}
    const oldExtra = extra === '' ? {} : JSON.parse(extra)
    await editArticle({
      ...(res?.[0] || {}),
      extra: JSON.stringify({
        ...oldExtra,
        newExtra
      })
    })
  } catch (e) {
    msg = 'updateExtraInfo:' + JSON.stringify(e)
  }
  console.log(msg)
}

const DEFAULT_FIELD = 'empty'

export async function create(req: Request, res: Response): Promise<void> {
  const { title = DEFAULT_FIELD, content = DEFAULT_FIELD, pid = 0, level = 0 } = req.body
  const params = {
    title,
    content,
    state: 1,
    pid,
    level
  }
  let msg = 'success'
  try {
    await createArticle(params)
  } catch (e) {
    msg = 'createArticle:' + JSON.stringify(e)
  }
  // 更新父节点的额外信息，优化查询
  updateExtraInfo({
    id: pid,
    extra: {
      haveChild: true
    }
  })
  res.status(200).send({
    code: 0,
    msg
  })
}

export async function edit(req: Request, res: Response): Promise<void> {
  const { title = DEFAULT_FIELD, content = DEFAULT_FIELD, id, tags = '' } = req.body
  const params = tags ? { id, tags } : { title, content, state: 1, pid: 0, id }
  let msg = 'success'
  try {
    await editArticle(params)
  } catch (e) {
    msg = 'editArticle:' + JSON.stringify(e)
  }
  res.status(200).send({
    code: 0,
    msg
  })
}

export async function del(req: Request, res: Response): Promise<void> {
  const { id, state } = req.body
  const params = {
    id,
    state
  }
  let msg = 'success'
  try {
    await editArticle(params)
  } catch (e) {
    msg = 'del:' + JSON.stringify(e)
  }
  res.status(200).send({
    code: 0,
    msg
  })
}

export async function search(req: Request, res: Response): Promise<void> {
  const data = await queryFullText(req)
  res.status(200).send({
    code: 0,
    data: data[0]
  })
}

export function getLabels(req: Request, res: Response): void {
  res.status(200).send({
    code: 0,
    data: env.labels,
    msg: 'success'
  })
}
