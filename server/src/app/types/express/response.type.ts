import type { JwtPayload } from 'jsonwebtoken'

/**
 * Global augmentation of Express Request interface
 * Adds user identification properties that are populated by authentication middleware
 */

interface IRequest extends Request {
  id: string
  user?: JwtPayload | string
}

export { IRequest }
