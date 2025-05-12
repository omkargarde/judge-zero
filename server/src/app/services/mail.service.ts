import { env } from "node:process";
import nodemailer from "nodemailer";

import { Env } from "../../env.ts";
const SendVerificationTokenMail = async (token: string, email: string) => {
  // Looking to send emails in production? Check out our Email API/SMTP product!
  const transporter = nodemailer.createTransport({
    auth: {
      pass: Env.MAILTRAP_PASSWORD,
      user: Env.MAILTRAP_USERNAME,
    },
    host: Env.MAILTRAP_HOST,
    port: env.MAILTRAP_PORT,
  });

  const mailOptions = {
    from: Env.MAILTRAP_SENDER_EMAIL,
    subject: "Verify your email",
    text: `Please click on the following link to verify your email: ${Env.BASE_URL}/api/v1/users/verify/${token}`,
    to: email,
  };

  await transporter.sendMail(mailOptions);
};

const SendForgotPasswordTokenMail = async (
  resetToken: string,
  email: string
) => {
  const transporter = nodemailer.createTransport({
    auth: {
      pass: Env.MAILTRAP_PASSWORD,
      user: Env.MAILTRAP_USERNAME,
    },
    host: Env.MAILTRAP_HOST,
  });
  const mailOptions = {
    from: Env.MAILTRAP_SENDER_EMAIL,
    subject: "Reset your password",
    text: `Please click on the following link to reset your password: ${Env.BASE_URL}/api/v1/users/reset-password/${resetToken}`,
    to: email,
  };
  await transporter.sendMail(mailOptions);
};

export { SendForgotPasswordTokenMail, SendVerificationTokenMail };
