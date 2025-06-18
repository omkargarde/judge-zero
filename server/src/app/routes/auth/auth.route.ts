import { Router } from 'express'

import {
  forgotPasswordRateLimiter,
  loginRateLimiter,
  registerRateLimiter,
  resetPasswordRateLimiter,
  verifyRateLimiter,
} from '../../services/rate-limiter.service.ts'
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

const authRouter: Router = Router()

// Apply rate limiters per route
authRouter.post('/register', registerRateLimiter, registerUser)
authRouter.post('/verify/:token', verifyRateLimiter, verifyUser)
authRouter.post('/login', loginRateLimiter, loginUser)
authRouter.get('/me', isLoggedIn, getMe)
authRouter.get('/logout', isLoggedIn, logoutUser)
authRouter.post('/forgot-password', forgotPasswordRateLimiter, forgotPassword)
authRouter.post('/reset-password/:token', resetPasswordRateLimiter, resetPassword)

export { authRouter }
