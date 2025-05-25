import { Router } from 'express'

import {
  loginRateLimiter,
  registerRateLimiter,
  verifyRateLimiter,
  forgotPasswordRateLimiter,
  resetPasswordRateLimiter,
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

const authRouter = Router()

// Apply rate limiters per route
authRouter.post('/register', registerRateLimiter, registerUser)
authRouter.post('/verify/:token', verifyRateLimiter, verifyUser)
authRouter.post('/login', loginRateLimiter, loginUser)
authRouter.get('/me', isLoggedIn, getMe) // No rate limit for profile fetch
authRouter.get('/logout', isLoggedIn, logoutUser) // No rate limit for logout
authRouter.post('/forgot-password', forgotPasswordRateLimiter, forgotPassword)
authRouter.post('/reset-password/:token', resetPasswordRateLimiter, resetPassword)

export { authRouter }
