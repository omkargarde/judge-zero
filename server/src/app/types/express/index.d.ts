import type { JwtPayload } from 'jsonwebtoken'
import type { UserRole } from '../../../../generated/prisma/index.js'

/**
 * Global augmentation of Express Request interface
 * Adds user identification properties that are populated by authentication middleware
 */
declare global {
  namespace Express {
    interface Request {
      id: string
      user?: (
        | { id: string, role: UserRole }
        | (JwtPayload & { id?: string, role?: UserRole })
        | undefined
      )
    }
  }
}
