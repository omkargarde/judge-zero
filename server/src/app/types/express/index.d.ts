import type { JwtPayload } from 'jsonwebtoken'
import type { User } from '../../../../generated/prisma/index.js'

/**
 * Global augmentation of Express Request interface
 * Adds user identification properties that are populated by authentication middleware
 */
declare global {
  namespace Express {
    interface Request {
      id: string
      user?: JwtPayload | string
    }
  }
}
