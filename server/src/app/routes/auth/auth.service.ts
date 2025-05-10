import { db } from "../../../libs/db.ts";
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
  return await db.user.create({
    data: {
      email,
      password,
      username,
    },
  });
};

const AddEmailVerificationToken = async (email: string) => {
  const token = UnHashedToken();
  return await db.user.update({
    data: {
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

const ResetPassword = async (user: unknown, resetToken: string) => {
  if (user instanceof UserModel) {
    user.forgotPasswordToken = resetToken;
    user.forgotPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000);
    return await user.save();
  }
};

const SetNewPassword = async (user: unknown, password: string) => {
  if (user instanceof UserModel) {
    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    return await user.save();
  }
};
export {
  AddEmailVerificationToken,
  CreateUser,
  FindUser,
  FindUserWithToken,
  ResetPassword,
  SetNewPassword,
  VerifyUser,
};
