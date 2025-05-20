// HTTP Response Status Codes
const HTTP_STATUS_CODES = {
  Accepted: 202,
  BadGateway: 502,
  BadRequest: 400,
  Conflict: 409,
  Created: 201,
  Forbidden: 403,
  Found: 302,
  GatewayTimeout: 504,
  Gone: 410,
  InternalServerError: 500,
  MethodNotAllowed: 405,
  MovedPermanently: 301,
  MultipleChoices: 300,
  NoContent: 204,
  NotFound: 404,
  NotImplemented: 501,
  Ok: 200,
  PartialContent: 206,
  PaymentRequired: 402,
  RequestTimeout: 408,
  ServiceUnavailable: 503,
  TooManyRequests: 429,
  Unauthorized: 401,
  UnprocessableEntity: 422,
} as const

// HTTP Response Status Messages
const HTTP_STATUS_MESSAGES = {
  BadRequest: 'Bad Request',
  Created: 'Created',
  Forbidden: 'Forbidden',
  NoContent: 'No Content',
  NotFound: 'Not Found',
  OK: 'OK',
  ServiceAvailable: 'Service available',
  Unauthorized: 'Unauthorized',
} as const

// HTTP Response Error Messages
const HTTP_ERROR_MESSAGES = {
  BadRequest: 'Invalid request',
  Conflict: 'Resource already exists',
  Forbidden: 'Access denied',
  InternalServerError: 'Internal server error',
  NotFound: 'Resource not found',
  ServiceUnavailable: 'Service unavailable',
  Unauthorized: 'Authentication failed',
  UnprocessableEntity: 'Unable to process request',
} as const

export { HTTP_ERROR_MESSAGES, HTTP_STATUS_CODES, HTTP_STATUS_MESSAGES }
