import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      id: string;
      user?: JwtPayload | string;
    }
  }
}
