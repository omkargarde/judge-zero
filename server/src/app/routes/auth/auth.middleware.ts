import type { NextFunction, Request, Response } from 'express'

import type { User } from '../../../../generated/prisma/index.js'
import { UserRole } from '../../../../generated/prisma/index.js'
import { db } from '../../../libs/db.ts'
import { Logger } from '../../../logger.ts'
import { HTTP_ERROR_MESSAGES } from '../../constants/status.constant.ts'
import { VerifyToken } from '../../services/token.service.ts'
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '../../utils/error.util.ts'
import { AUTH_MESSAGES } from './auth.constant.ts'

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  try {
    Logger.info('=== Auth Middleware Debug ===')
    Logger.info('Cookies:', req.cookies)
    Logger.info('Headers:', {
      authorization: req.headers.authorization,
      cookie: req.headers.cookie,
    })

    let token = req.cookies.token as string

    // Check Authorization header if no cookie
    if (
      (!token || token === '')
      && typeof req.headers.authorization === 'string'
      && req.headers.authorization !== ''
    ) {
      token = req.headers.authorization.replace('Bearer ', '')
    }
    if (!token || token === '') {
      throw new NotFoundException(AUTH_MESSAGES.TokenNotFound)
    }
    Logger.info('Authentication token found')
    try {
      // Verify token
      const decoded = VerifyToken(token)
      Logger.info('Token verified successfully')

      req.user = decoded
      next()
    }
    catch (error) {
      throw new UnauthorizedException(AUTH_MESSAGES.BadToken, error)
    }
  }
  catch (error) {
    throw new InternalServerErrorException(
      HTTP_ERROR_MESSAGES.InternalServerError,
      error,
    )
  }
}

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user === undefined || req.user === null) {
      throw new UnauthorizedException('User not authenticated')
    }
    const userDataFromSession = req.user as User
    const userDataFromDb = await db.user.findUnique({
      where: {
        id: userDataFromSession.id,
      },
      select: {
        role: true,
      },
    })

    if (!userDataFromDb) {
      Logger.error('user not found while checking for admin role')
      throw new NotFoundException(HTTP_ERROR_MESSAGES.NotFound)
    }
    if (userDataFromDb.role !== UserRole.ADMIN) {
      Logger.error('user is not admin')
      throw new UnauthorizedException(`${HTTP_ERROR_MESSAGES.Unauthorized}--only admins can access the route`)
    }

    next()
  }
  catch (error) {
    // Re-throw custom exceptions
    if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
      throw error
    }
    Logger.error('uncaught error while checking user role')
    throw new InternalServerErrorException(
      HTTP_ERROR_MESSAGES.InternalServerError,
      error,
    )
  }
}

export { isAdmin, isLoggedIn }
