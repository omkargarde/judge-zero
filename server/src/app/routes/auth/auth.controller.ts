//user controllers
import type { CookieOptions, Request, Response } from "express";

import bcrypt from "bcryptjs";

import type { ICustomRequest } from "../../types/custom-request.types.ts";
import type { IUserRequestBody } from "./auth.type.ts";

import { Logger } from "../../../logger.ts";
import { HTTP_STATUS_CODES } from "../../constants/status.constant.ts";
import {
  SendForgotPasswordTokenMail,
  SendVerificationTokenMail,
} from "../../services/mail.service.ts";
import {
  FlushJwtCookieOptions,
  GenerateAccessToken,
  GetJwtCookieOptions,
  UnHashedToken,
} from "../../services/token.service.ts";
import { ApiResponse } from "../../utils/api-response.util.ts";
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "../../utils/error.util.ts";
import { AUTH_MESSAGES, UserToken } from "./auth.constant.ts";
import {
  AddEmailVerificationToken,
  CreateUser,
  FindUser,
  FindUserWithToken,
  GetUser,
  ResetPassword,
  SetNewPassword,
  VerifyUser,
} from "./auth.service.ts";
import {
  userEmailVerificationSchema,
  userForgotPasswordSchema,
  userLoginSchema,
  userRegistrationSchema,
  userResetForgottenPasswordSchema,
} from "./auth.validator.ts";

const registerUser = async (req: Request, res: Response) => {
  //register user

  const { email, password, username } = req.body as IUserRequestBody;
  const { success } = userRegistrationSchema.safeParse(req.body);
  if (!success) {
    throw new InternalServerErrorException();
  }
  try {
    Logger.info("Find if user already exists");
    const existingUser = await FindUser(email);
    if (existingUser) {
      throw new ConflictException(AUTH_MESSAGES.UserConflict);
    }

    Logger.info("creating new user");
    const user = await CreateUser(email, password, username);

    Logger.info("verifying user");
    const verificationUser = await AddEmailVerificationToken(user.email);

    if (!verificationUser.emailVerificationToken || !verificationUser.email) {
      Logger.error("Missing email verification token or email");
      throw new InternalServerErrorException("Missing token or email");
    }

    try {
      await SendVerificationTokenMail(
        verificationUser.emailVerificationToken,
        verificationUser.email
      );
    } catch (mailError) {
      Logger.error("Failed to send verification email", mailError);
      throw new InternalServerErrorException(
        "Failed to send verification email"
      );
    }

    return res
      .status(HTTP_STATUS_CODES.Ok)
      .json(
        new ApiResponse(
          HTTP_STATUS_CODES.Ok,
          "",
          AUTH_MESSAGES.SucceededUserCreation
        )
      );
  } catch (error) {
    Logger.error("User registration failed:", error);
    if (
      error instanceof ConflictException ||
      error instanceof UnprocessableEntityException ||
      error instanceof InternalServerErrorException
    ) {
      throw error;
    }
    throw new UnprocessableEntityException(AUTH_MESSAGES.FailedUserCreation);
  }
};

const verifyUser = async (req: Request, res: Response) => {
  //verify user
  const { token } = req.params;
  const { success } = userEmailVerificationSchema.safeParse(req.params);
  if (!success || !token) {
    throw new BadRequestException(AUTH_MESSAGES.BadEmailToken);
  }

  const user = await FindUserWithToken(token);
  if (
    !user ||
    !user.emailVerificationToken ||
    !user.emailVerificationExpiry ||
    user.emailVerificationExpiry < new Date()
  ) {
    throw new BadRequestException(AUTH_MESSAGES.BadEmailToken);
  }
  await VerifyUser(user.email);

  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(
      new ApiResponse(HTTP_STATUS_CODES.Ok, "", AUTH_MESSAGES.VerifiedUserEmail)
    );
};

const loginUser = async (req: Request, res: Response) => {
  Logger.info(req.body);
  const { success } = userLoginSchema.safeParse(req.body);
  if (!success) {
    throw new InternalServerErrorException();
  }
  const { email, password } = req.body as IUserRequestBody;
  const user = await FindUser(email);
  if (!user) {
    throw new BadRequestException(AUTH_MESSAGES.CredFailed);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  if (!isMatch) {
    throw new BadRequestException(AUTH_MESSAGES.CredFailed);
  }

  const token = GenerateAccessToken(user.id, user.email, user.username);

  const cookieOptions: CookieOptions = GetJwtCookieOptions();

  res.cookie(UserToken.token, token, cookieOptions);

  const returnUser = {
    email: user.email,
    id: user.id,
    name: user.username,
    role: user.role,
  };
  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(
      new ApiResponse(
        HTTP_STATUS_CODES.Ok,
        returnUser,
        AUTH_MESSAGES.credSuccess
      )
    );
};

const getMe = async (req: ICustomRequest, res: Response) => {
  const user = await GetUser(req.id);
  if (!user) {
    throw new NotFoundException(AUTH_MESSAGES.UserNotFound);
  }

  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(new ApiResponse(HTTP_STATUS_CODES.Ok, user, AUTH_MESSAGES.UserFound));
};

const logoutUser = (req: Request, res: Response) => {
  // Clear the token cookie
  const cookieOptions = FlushJwtCookieOptions();
  res.cookie(UserToken.token, "", cookieOptions);
  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(
      new ApiResponse(HTTP_STATUS_CODES.Ok, "", AUTH_MESSAGES.UserLoggedOut)
    );
};

const forgotPassword = async (req: Request, res: Response) => {
  //get user by email and send reset token
  const { email } = req.body as IUserRequestBody;
  const { success } = userForgotPasswordSchema.safeParse(req.body);
  if (!success) {
    throw new BadRequestException(AUTH_MESSAGES.EmailNotProvided);
  }

  const user = await FindUser(email);
  if (!user) {
    throw new BadRequestException(AUTH_MESSAGES.InvalidEmail);
  }
  const resetToken = UnHashedToken();
  await ResetPassword(user.email, resetToken);

  await SendForgotPasswordTokenMail(user.email, resetToken);

  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(
      new ApiResponse(HTTP_STATUS_CODES.Ok, "", AUTH_MESSAGES.ForgotPassword)
    );
};

const resetPassword = async (req: Request, res: Response) => {
  //reset password
  const { token } = req.params;
  if (!token) {
    throw new BadRequestException(AUTH_MESSAGES.BadToken);
  }
  const { password } = req.body as IUserRequestBody;
  const { success } = userResetForgottenPasswordSchema.safeParse(req.params);
  if (!success) {
    throw new InternalServerErrorException();
  }
  const user = await FindUserWithToken(token);
  if (!user) {
    throw new NotFoundException(AUTH_MESSAGES.UserNotFound);
  }
  await SetNewPassword(user.email, password);
  res
    .status(HTTP_STATUS_CODES.Ok)
    .json(
      new ApiResponse(
        HTTP_STATUS_CODES.Ok,
        "",
        AUTH_MESSAGES.forgotPasswordSuccess
      )
    );
};

export {
  forgotPassword,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
};
