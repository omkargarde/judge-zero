import type { TSameSite } from '../types/same-site.type.ts'
import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

import { Env } from '../../env.ts'
import { IS_PRODUCTION } from '../constants/env.constant.ts'

async function ComparePassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

async function HashPassword(password: string) {
  return bcrypt.hash(password, Number(Env.SALT_ROUNDS))
}

function GenerateAccessToken(id: string, email: string, username: string) {
  return jwt.sign(
    {
      email,
      id,
      username,
    },
    Env.JWT_SECRET,
    { expiresIn: Env.JWT_EXPIRE_TIME },
  )
}

function VerifyToken(token: string) {
  return jwt.verify(token, Env.JWT_SECRET)
}
function UnHashedToken() {
  return crypto.randomBytes(20).toString('hex')
}

function HashedToken(unHashedToken: crypto.BinaryLike) {
  crypto.createHash('sha256').update(unHashedToken).digest('hex')
}

function GetJwtCookieOptions() {
  return {
    httpOnly: Env.NODE_ENV === IS_PRODUCTION, // Set to false for testing
    maxAge: Number(Env.JWT_MAX_AGE), // use environment variable for configurability
    path: '/',
    sameSite: 'lax' as TSameSite,
    secure: Env.NODE_ENV === IS_PRODUCTION, // Set to false for local development
  }
}

function FlushJwtCookieOptions() {
  return {
    expires: new Date(0), // This will make the cookie expire immediately
    httpOnly: Env.NODE_ENV === IS_PRODUCTION,
    path: '/',
    sameSite: 'lax' as TSameSite,
    secure: false,
  }
}

export {
  ComparePassword,
  FlushJwtCookieOptions,
  GenerateAccessToken,
  GetJwtCookieOptions,
  HashedToken,
  HashPassword,
  UnHashedToken,
  VerifyToken,
}
