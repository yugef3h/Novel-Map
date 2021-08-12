import { Router } from 'express'
import apiRouter from './api'

const router = Router()

router.use('/v1', apiRouter)

export default router
