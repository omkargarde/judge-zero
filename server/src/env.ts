import process from 'node:process'
import { z } from 'zod'

const envSchema = z.object({
  BASE_URL: z.string(),
  CORS_ORIGIN: z.string(),
  DATABASE_URL: z.string(),
  JWT_COOKIE_EXPIRE_TIME: z.string(),
  JWT_EXPIRE_TIME: z.string(),
  JWT_MAX_AGE: z.string().transform(Number).pipe(z.number().positive()),
  JWT_SECRET: z.string(),
  MAILTRAP_HOST: z.string(),
  MAILTRAP_PASSWORD: z.string(),
  MAILTRAP_PORT: z.string(),
  MAILTRAP_SENDER_EMAIL: z.string().email(),
  MAILTRAP_USERNAME: z.string(),
  NODE_ENV: z.string(),
  PORT: z.string(),
  SALT_ROUNDS: z.string().transform(Number).pipe(z.number().int().positive()),
})

function createEnv(env: NodeJS.ProcessEnv) {
  const validationResult = envSchema.safeParse(env)
  if (!validationResult.success)
    throw new Error(validationResult.error.message)
  return validationResult.data
}

export const Env = createEnv(process.env)
