import type { NextFunction, Request, Response } from 'express'
import type { AnyZodObject } from 'zod'
import { HTTP_STATUS_CODES } from '../constants/status.constant.ts'

// ...

function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body as Record<string, unknown>,
        params: req.params as Record<string, unknown>,
        query: req.query as Record<string, unknown>,
      })
      next()
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(HTTP_STATUS_CODES.BadRequest).json({ message: error.message })
      }
      return res.status(HTTP_STATUS_CODES.BadRequest).json({ message: 'Validation error' })
    }
  }
}
export { validate }
