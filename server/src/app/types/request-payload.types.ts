import type { JwtPayload } from 'jsonwebtoken'

interface UserPayload {
  id: string
  user: JwtPayload | string
}
export type { UserPayload }
