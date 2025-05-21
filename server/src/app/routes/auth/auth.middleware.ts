import type { NextFunction, Request, Response } from 'express'

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

export { isLoggedIn }
