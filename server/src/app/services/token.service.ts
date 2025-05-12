import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import type { TSameSite } from "../types/same-site.type.ts";

import { Env } from "../../env.ts";
import { IS_PRODUCTION } from "../constants/env.constant.ts";

const ComparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, Number(Env.SALT_ROUNDS));
};

const GenerateAccessToken = (id: string, email: string, username: string) => {
  return jwt.sign(
    {
      email: email,
      id: id,
      username: username,
    },
    Env.JWT_SECRET,
    { expiresIn: Env.JWT_EXPIRE_TIME }
  );
};

const VerifyToken = (token: string) => {
  return jwt.verify(token, Env.JWT_SECRET);
};
const UnHashedToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

const HashedToken = (unHashedToken: crypto.BinaryLike) => {
  crypto.createHash("sha256").update(unHashedToken).digest("hex");
};

const GetJwtCookieOptions = () => {
  return {
    httpOnly: Env.NODE_ENV === IS_PRODUCTION, // Set to false for testing
    maxAge: 24 * 60 * 60 * 1000, // directly use the max age value
    path: "/",
    sameSite: "lax" as TSameSite,
    secure: Env.NODE_ENV === IS_PRODUCTION, // Set to false for local development
  };
};

const FlushJwtCookieOptions = () => {
  return {
    expires: new Date(0), // This will make the cookie expire immediately
    httpOnly: Env.NODE_ENV === IS_PRODUCTION,
    path: "/",
    sameSite: "lax" as TSameSite,
    secure: false,
  };
};

export {
  ComparePassword,
  FlushJwtCookieOptions,
  GenerateAccessToken,
  GetJwtCookieOptions,
  HashedToken,
  hashPassword,
  UnHashedToken,
  VerifyToken,
};
