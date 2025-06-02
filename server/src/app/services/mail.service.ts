import nodemailer from 'nodemailer'

import { Env } from '../../env.ts'
import { Logger } from '../../logger.ts'

function getTransporter() {
  return nodemailer.createTransport({
    auth: {
      pass: Env.MAILTRAP_PASSWORD,
      user: Env.MAILTRAP_USERNAME,
    },
    host: Env.MAILTRAP_HOST,
    port: Env.MAILTRAP_PORT,
  })
}

async function SendVerificationTokenMail(token: string, email: string) {
  const transporter = getTransporter()

  const mailOptions = {
    from: Env.MAILTRAP_SENDER_EMAIL,
    subject: 'Verify your email',
    text: `Please click on the following link to verify your email: ${Env.BASE_URL}/api/v1/users/verify/${token}`,
    to: email,
  }

  try {
    await transporter.sendMail(mailOptions)
  }
  catch (error) {
    Logger.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

async function SendForgotPasswordTokenMail(resetToken: string, email: string) {
  const transporter = getTransporter()

  const mailOptions = {
    from: Env.MAILTRAP_SENDER_EMAIL,
    subject: 'Reset your password',
    text: `Please click on the following link to reset your password: ${Env.BASE_URL}/api/v1/users/reset-password/${resetToken}`,
    to: email,
  }
  try {
    await transporter.sendMail(mailOptions)
  }
  catch (error) {
    Logger.error('Failed to send password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}

export { SendForgotPasswordTokenMail, SendVerificationTokenMail }
