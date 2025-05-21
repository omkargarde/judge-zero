import { Router } from 'express'

import { HealthCheck } from './health.controller.ts'

const router = Router()
router.get('/hc', HealthCheck)
export { router as healthRouter }
