import {
  HTTP_ERROR_MESSAGES,
  HTTP_STATUS_CODES,
  HTTP_STATUS_MESSAGES,
} from '../constants/status.constant.ts'

class ApiError extends Error {
  protected errors
  protected statusCode: number
  protected success = false
  public constructor(
    statusCode: number = 500,
    message: string = 'Something went wrong',
    errors: unknown[] = [],
    stack: string = '',
  ) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    this.success = false
    this.errors = errors

    if (stack) {
      this.stack = stack
    }
    else {
      // Study this more
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

class BadRequestException extends ApiError {
  constructor(
    message: string = HTTP_ERROR_MESSAGES.BadRequest,
    error?: unknown,
  ) {
    super(HTTP_STATUS_CODES.BadRequest, message, [error])
  }
}

class ConflictException extends ApiError {
  constructor(message: string = HTTP_ERROR_MESSAGES.Conflict, error?: unknown) {
    super(HTTP_STATUS_CODES.Conflict, message, [error])
  }
}

class InternalServerErrorException extends ApiError {
  constructor(
    message: string = HTTP_ERROR_MESSAGES.InternalServerError,
    error?: unknown,
  ) {
    super(HTTP_STATUS_CODES.InternalServerError, message, [error])
  }
}
class NotFoundException extends ApiError {
  constructor(
    message: string = HTTP_ERROR_MESSAGES.NotFound,
    error?: unknown,
  ) {
    super(HTTP_STATUS_CODES.NotFound, message, [error])
  }
}

class UnauthorizedException extends ApiError {
  constructor(message: string = HTTP_STATUS_MESSAGES.Unauthorized, error?: unknown) {
    super(HTTP_STATUS_CODES.Unauthorized, message, [error])
  }
}
class UnprocessableEntityException extends ApiError {
  constructor(
    message: string = HTTP_ERROR_MESSAGES.UnprocessableEntity,
    error?: unknown,
  ) {
    super(HTTP_STATUS_CODES.UnprocessableEntity, message, [error])
  }
}
export {
  ApiError,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
}
