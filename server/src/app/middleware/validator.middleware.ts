import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";

// ...

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
      return;
    } catch (error) {
      return res.status(400).json(error);
    }
  };
export { validate };
