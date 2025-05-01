import { z } from "zod";

const userRegistrationSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Email is invalid" }),
  fullName: z.string().trim().optional(),
  password: z.string({ required_error: "Password is required" }).trim().min(6, {
    message: "Password must consist of a minimum of six characters",
  }),
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .toLowerCase()
    .min(3, { message: "Username must be at least 3 characters long" }),
});

const userLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Email is invalid" })
    .toLowerCase(),
  password: z.string({ required_error: "Password is required" }),
});

const userChangeCurrentPasswordSchema = z.object({
  newPassword: z.string({ required_error: "New password is required" }),
  oldPassword: z.string({ required_error: "Old password is required" }),
});

const userForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email is invalid" })
    .toLowerCase(),
});

const userResetForgottenPasswordSchema = z.object({
  newPassword: z.string({ required_error: "Password is required" }),
});

const userEmailVerificationSchema = z.object({
  token: z.string({ required_error: "verification token is required" }),
});

export {
  userChangeCurrentPasswordSchema,
  userEmailVerificationSchema,
  userForgotPasswordSchema,
  userLoginSchema,
  userRegistrationSchema,
  userResetForgottenPasswordSchema,
};
