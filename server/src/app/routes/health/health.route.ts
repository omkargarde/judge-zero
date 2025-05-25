import { Router } from 'express'

import { HealthCheck } from './health.controller.ts'

const healthRouter = Router()

healthRouter.get('/hc', HealthCheck)

export { healthRouter }
