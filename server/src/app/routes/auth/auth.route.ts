import { Router } from 'express'

import { RateLimiter } from '../../services/rate-limiter.service.ts'
import {
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
} from './auth.controller.ts'
import { isLoggedIn } from './auth.middleware.ts'

const authRouter = Router()

authRouter.use(RateLimiter)

authRouter.post('/register', registerUser)
authRouter.post('/verify/:token', verifyUser)
authRouter.post('/login', loginUser)
authRouter.get('/me', isLoggedIn, getMe)
authRouter.get('/logout', isLoggedIn, logoutUser)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password/:token', resetPassword)

export { authRouter }
