import { UnHashedToken } from "../../services/token.service.ts";
import { UserModel } from "../models/user.model.ts";

const FindUser = async (email: string) => {
  return await UserModel.findOne({
    email: { $eq: email },
  });
};

const CreateUser = async (
  email: string,
  password: string,
  username: string
) => {
  return await UserModel.create({
    email,
    password,
    username,
  });
};

const AddEmailVerificationToken = async (user: unknown) => {
  if (user instanceof UserModel) {
    const token = UnHashedToken();
    user.emailVerificationToken = token;
    await user.save();
  }
};

const FindUserWithToken = async (token: string) => {
  return await UserModel.findOne({
    emailVerificationExpiry: { $gt: Date.now() },
    emailVerificationToken: token,
  });
};

const VerifyUser = async (user: unknown) => {
  if (user instanceof UserModel) {
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;
    return await user.save();
  }
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
