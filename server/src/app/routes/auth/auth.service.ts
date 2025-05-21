import { db } from '../../../libs/db.ts'
import { Logger } from '../../../logger.ts'
import { HashPassword, UnHashedToken } from '../../services/token.service.ts'

async function FindUser(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
  })
}

async function CreateUser(email: string, password: string, username: string) {
  try {
    const hashedPassword = await HashPassword(password)
    return await db.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    })
  }
  catch (error) {
    Logger.error(error)
    throw error
  }
}

async function AddEmailVerificationToken(email: string) {
  const token = UnHashedToken()
  return db.user.update({
    data: {
      emailVerificationExpiry: new Date(Date.now() + 10 * 60 * 1000),
      emailVerificationToken: token,
    },
    where: {
      email,
    },
  })
}

async function FindUserWithToken(token: string) {
  return db.user.findFirst({
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
  })
}

async function VerifyUser(email: string) {
  return db.user.update({
    data: {
      emailVerificationExpiry: null,
      emailVerificationToken: null,
      isEmailVerified: true,
    },
    where: {
      email,
    },
  })
}

async function ResetPassword(email: string, resetToken: string) {
  return db.user.update({
    data: {
      forgotPasswordExpiry: new Date(Date.now() + 10 * 60 * 1000),
      forgotPasswordToken: resetToken,
    },
    where: {
      email,
    },
  })
}

async function SetNewPassword(email: string, password: string) {
  try {
    const hashedPassword = await HashPassword(password)
    return await db.user.update({
      data: {
        forgotPasswordExpiry: null,
        forgotPasswordToken: null,
        password: hashedPassword,
      },
      where: {
        email,
      },
    })
  }
  catch (error) {
    Logger.error(error)
    throw error
  }
}

async function GetUser(id: string) {
  return db.user.findUnique({
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
      id,
    },
  })
}

export {
  AddEmailVerificationToken,
  CreateUser,
  FindUser,
  FindUserWithToken,
  GetUser,
  ResetPassword,
  SetNewPassword,
  VerifyUser,
}
