import type { Types } from "mongoose";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import type { TSameSite } from "../types/same-site.type.ts";

import { Env } from "../../env.ts";
import {
  IS_DEVOLVEMENT,
  IS_NOT_DEVOLVEMENT,
} from "../constants/env.constant.ts";

const ComparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

const GenerateAccessToken = (
  id: Types.ObjectId,
  email: string,
  username: string
) => {
  return jwt.sign(
    {
      _id: id,
      email: email,
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
    httpOnly: Env.NODE_ENV === IS_NOT_DEVOLVEMENT, // Set to false for testing
    maxAge: Number(Env.JWT_EXPIRE_TIME), // convert to number
    path: "/",
    sameSite: "lax" as TSameSite,
    secure: Env.NODE_ENV === IS_NOT_DEVOLVEMENT, // Set to false for local development
  };
};

const FlushJwtCookieOptions = () => {
  return {
    expires: new Date(0), // This will make the cookie expire immediately
    httpOnly: Env.NODE_ENV === IS_NOT_DEVOLVEMENT,
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
  UnHashedToken,
  VerifyToken,
};
