// user controllers
import type { CookieOptions, NextFunction, Request, Response } from 'express'

import bcrypt from 'bcryptjs'
import { Logger } from '../../../logger.ts'
import {
  HTTP_STATUS_CODES,
} from '../../constants/status.constant.ts'
import {
  SendVerificationTokenMail,
} from '../../services/mail.service.ts'
import {
  FlushJwtCookieOptions,
  GenerateAccessToken,
  GetJwtCookieOptions,
  UnHashedToken,
} from '../../services/token.service.ts'
import { ApiResponse } from '../../utils/api-response.util.ts'
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '../../utils/error.util.ts'
import { AUTH_MESSAGES, UserToken } from './auth.constant.ts'
import {
  AddEmailVerificationToken,
  CreateUser,
  FindUser,
  FindUserWithToken,
  GetUser,
  ResetPassword,
  SetNewPassword,
  VerifyUser,
} from './auth.service.ts'
import {
  userEmailVerificationSchema,
  userForgotPasswordSchema,
  userLoginSchema,
  userRegistrationSchema,
  userResetForgottenPasswordSchema,
} from './auth.validator.ts'

async function registerUser(req: Request, res: Response, next: NextFunction) {
  const result = userRegistrationSchema.safeParse(req.body)
  if (!result.success) {
    throw new BadRequestException(JSON.stringify(result.error.flatten()))
  }
  const { email, password, username } = result.data
  try {
    Logger.info('Finding if user already exists')
    const existingUser = await FindUser(email)
    if (existingUser) {
      throw new ConflictException(AUTH_MESSAGES.UserConflict)
    }

    Logger.info('creating new user')
    const user = await CreateUser(email, password, username)

    Logger.info('verifying user')
    const verificationUser = await AddEmailVerificationToken(user.email)

    if (
      verificationUser.emailVerificationToken === null
      || verificationUser.emailVerificationToken === ''
      || verificationUser.email === null
      || verificationUser.email === ''
    ) {
      Logger.error('Missing email verification token or email')
      throw new InternalServerErrorException('Missing token or email')
    }

    try {
      await SendVerificationTokenMail(
        verificationUser.emailVerificationToken,
        verificationUser.email,
      )
    }
    catch (mailError) {
      Logger.error('Failed to send verification email', mailError)
      next(mailError)
    }

    res
      .status(HTTP_STATUS_CODES.Ok)
      .json(
        new ApiResponse(
          HTTP_STATUS_CODES.Ok,
          '',
          AUTH_MESSAGES.SucceededUserCreation,
        ),
      )
  }
  catch (error) {
    next(error)
  }
}

async function verifyUser(req: Request, res: Response) {
  // verify user
  const { token } = req.params
  const result = userEmailVerificationSchema.safeParse(req.params)
  if (
    !result.success
    || token === null
    || token === undefined
    || token === ''
  ) {
    throw new BadRequestException(AUTH_MESSAGES.BadEmailToken)
  }

  const user = await FindUserWithToken(token)
  if (
    !user
    || user.emailVerificationToken === null
    || user.emailVerificationToken === undefined
    || user.emailVerificationToken === ''
    || user.emailVerificationExpiry === null
    || user.emailVerificationExpiry === undefined
    || user.emailVerificationExpiry < new Date()
  ) {
    throw new BadRequestException(AUTH_MESSAGES.BadEmailToken)
  }
  await VerifyUser(user.email)

  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(
      new ApiResponse(HTTP_STATUS_CODES.Ok, '', AUTH_MESSAGES.VerifiedUserEmail),
    )
}

async function loginUser(req: Request, res: Response) {
  const result = userLoginSchema.safeParse(req.body)
  if (!result.success) {
    throw new BadRequestException(JSON.stringify(result.error.flatten()))
  }
  const { email, password } = result.data

  const user = await FindUser(email)
  if (!user) {
    throw new BadRequestException(AUTH_MESSAGES.CredFailed)
  }
  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new BadRequestException(AUTH_MESSAGES.CredFailed)
  }

  const token = GenerateAccessToken(user.id, user.email, user.username, user.role)

  const cookieOptions: CookieOptions = GetJwtCookieOptions()

  res.cookie(UserToken.token, token, cookieOptions)

  const returnUser = {
    email: user.email,
    id: user.id,
    image: user.avatarUrl,
    name: user.username,
    role: user.role,
  }
  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(
      new ApiResponse(
        HTTP_STATUS_CODES.Ok,
        returnUser,
        AUTH_MESSAGES.credSuccess,
      ),
    )
}

async function getMe(req: Request, res: Response) {
  const user = await GetUser(req.id)
  if (!user) {
    throw new NotFoundException(AUTH_MESSAGES.UserNotFound)
  }

  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(new ApiResponse(HTTP_STATUS_CODES.Ok, user, AUTH_MESSAGES.UserFound))
}

function logoutUser(req: Request, res: Response) {
  // Clear the token cookie
  const cookieOptions = FlushJwtCookieOptions()
  res.cookie(UserToken.token, '', cookieOptions)
  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(
      new ApiResponse(HTTP_STATUS_CODES.Ok, '', AUTH_MESSAGES.UserLoggedOut),
    )
}

async function forgotPassword(req: Request, res: Response) {
  // get user by email and send reset token
  const result = userForgotPasswordSchema.safeParse(req.body)
  if (!result.success) {
    throw new BadRequestException(AUTH_MESSAGES.EmailNotProvided)
  }
  const { email } = result.data

  const user = await FindUser(email)
  if (!user) {
    throw new BadRequestException(AUTH_MESSAGES.InvalidEmail)
  }
  const resetToken = UnHashedToken()
  await ResetPassword(user.email, resetToken)

  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(
      new ApiResponse(HTTP_STATUS_CODES.Ok, '', AUTH_MESSAGES.ForgotPassword),
    )
}

async function resetPassword(req: Request, res: Response) {
  // reset password
  const { token } = req.params
  if (token === null || token === undefined || token === '') {
    throw new BadRequestException(AUTH_MESSAGES.BadToken)
  }
  const result = userResetForgottenPasswordSchema.safeParse(req.body)
  if (!result.success) {
    throw new BadRequestException(JSON.stringify(result.error.flatten()))
  }
  const { newPassword } = result.data
  const user = await FindUserWithToken(token)
  if (!user) {
    throw new NotFoundException(AUTH_MESSAGES.UserNotFound)
  }
  await SetNewPassword(user.email, newPassword)
  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(
      new ApiResponse(
        HTTP_STATUS_CODES.Ok,
        '',
        AUTH_MESSAGES.forgotPasswordSuccess,
      ),
    )
}

export {
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
}
