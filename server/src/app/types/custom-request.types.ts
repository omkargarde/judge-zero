import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

interface ICustomRequest extends Request {
  id: string;
  user: JwtPayload | string;
}
export type { ICustomRequest };
