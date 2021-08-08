import { Router } from 'express';
import * as articleController from '../controllers/article'

const apiRouter = Router();
apiRouter.get('/article/query_list', articleController.getList)

export default apiRouter