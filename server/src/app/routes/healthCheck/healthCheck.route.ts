import { Router } from 'express'

import { HealthCheck } from './healthCheck.controller.ts'

const healthCheckRouter: Router = Router()

healthCheckRouter.get('/hc', HealthCheck)

export { healthCheckRouter }
