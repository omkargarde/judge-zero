import type { JwtPayload } from 'jsonwebtoken'

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
