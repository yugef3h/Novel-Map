import { Router } from 'express'
import * as articleController from '../controllers/articleController'

const apiRouter = Router()
apiRouter.get('/article/query_list', articleController.getList)
apiRouter.get('/article/search', articleController.search)
apiRouter.post('/article/create', articleController.create)
apiRouter.post('/article/edit', articleController.edit)
apiRouter.post('/article/delete', articleController.del)
apiRouter.get('/article/query_labels', articleController.getLabels)

export default apiRouter
