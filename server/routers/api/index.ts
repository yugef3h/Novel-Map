import { Router } from 'express'
import * as articleController from '../controllers/articleController'

const apiRouter = Router()
apiRouter.get('/article/query_list', articleController.getList)
apiRouter.post('/article/create', articleController.create)
apiRouter.post('/article/edit', articleController.edit)

export default apiRouter
