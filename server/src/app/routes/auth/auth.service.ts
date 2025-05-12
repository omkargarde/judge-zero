import { db } from "../../../libs/db.ts";
import { Logger } from "../../../logger.ts";
import { UnHashedToken } from "../../services/token.service.ts";

const FindUser = async (email: string) => {
  return await db.user.findUnique({
    where: {
      email: email,
    },
  });
};

const CreateUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    return await db.user.create({
      data: {
        email: email,
        password: password,
        username: username,
      },
    });
  } catch (error) {
    Logger.error(error);
    throw error;
  }
};

const AddEmailVerificationToken = async (email: string) => {
  const token = UnHashedToken();
  return await db.user.update({
    data: {
      emailVerificationExpiry:new Date(Date.now() + 10 * 60 * 1000),
      emailVerificationToken: token, 
    },
    where: {
      email: email,
    },
  });
};

const FindUserWithToken = async (token: string) => {
  return await db.user.findFirst({
    where: {
      AND: [
        {
          emailVerificationExpiry: {
            gt: new Date(),
          },
        },
        {
          emailVerificationToken: token,
        },
      ],
    },
  });
};

const VerifyUser = async (email: string) => {
  return await db.user.update({
    data: {
      emailVerificationExpiry: null,
      emailVerificationToken: null,
      isEmailVerified: true,
    },
    where: {
      email: email,
    },
  });
};

const ResetPassword = async (email: string, resetToken: string) => {
  return db.user.update({
    data: {
      forgotPasswordExpiry: new Date(Date.now() + 10 * 60 * 1000),
      forgotPasswordToken: resetToken,
    },
    where: {
      email: email,
    },
  });
};

const SetNewPassword = async (email: string, password: string) => {
  return db.user.update({
    data: {
      forgotPasswordExpiry: null,
      forgotPasswordToken: null,
      password: password,
    },
    where: {
      email: email,
    },
  });
};

const GetUser = async (id: string) => {
  return await db.user.findUnique({
    select: {
      createdAt: true,
      email: true,
      emailVerificationExpiry: true,
      emailVerificationToken: true,
      forgotPasswordExpiry: true,
      forgotPasswordToken: true,
      id: true,
      isEmailVerified: true,
      updatedAt: true,
      username: true,
    },
    where: {
      id: id,
    },
  });
};

export {
  AddEmailVerificationToken,
  CreateUser,
  FindUser,
  FindUserWithToken,
  GetUser,
  ResetPassword,
  SetNewPassword,
  VerifyUser,
};
