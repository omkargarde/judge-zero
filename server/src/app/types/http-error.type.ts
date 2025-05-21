interface IHttpError extends Error {
  statusCode: null | number | undefined
}

export type { IHttpError }
