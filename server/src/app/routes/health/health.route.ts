import { Router } from 'express'

import { RateLimiter } from '../../services/rate-limiter.service.ts'
import { HealthCheck } from './health.controller.ts'

const healthRouter = Router()

healthRouter.use(RateLimiter)

healthRouter.get('/hc', HealthCheck)

export { healthRouter }
