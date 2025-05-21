import { Router } from 'express'
import rateLimit from 'express-rate-limit'

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

// Rate limiter: maximum of 5 requests per minute for verifyUser
const verifyUserRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many verification attempts from this IP, please try again later.',
})

authRouter.post('/register', registerUser)
authRouter.post('/verify/:token', verifyUserRateLimiter, verifyUser)
authRouter.post('/login', loginUser)
authRouter.get('/me', isLoggedIn, getMe)
authRouter.get('/logout', isLoggedIn, logoutUser)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password/:token', resetPassword)

export { authRouter }
