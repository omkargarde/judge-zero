import type { NextFunction, Request, Response } from "express";

/**
 * Wraps an asynchronous request handler function and ensures that any errors
 * are passed to the next middleware for handling. This aids in managing
 * errors in asynchronous routes by forwarding them to the express error
 * handling middleware.
 *
 * @param requestHandler - The asynchronous request handler function to wrap.
 * @returns A function that accepts Express.js request, response, and next
 * middleware function, and executes the request handler, catching any
 * errors and passing them to the next middleware.
 */
export function asyncHandler(
  requestHandler: (
    req: Request,
    res: Response,
  ) => Promise<Response | undefined>,
) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(requestHandler(req, res)).catch(function (err: unknown) {
      if (err instanceof Error) next(err);
      next(err);
    });
  };
}
// export function asyncHandler(requestHandler: RequestHandler) {
//   return function (req: Request, res: Response, next: NextFunction) {
//     Promise.resolve(requestHandler(req, res, next)).catch(function (
//       err: unknown,
//     ) {
//       if (err instanceof Error) next(err);
//     });
//   };
// }
