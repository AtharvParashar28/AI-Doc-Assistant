import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { customError } from "../models/customError";

export function validate(schema: ZodSchema) {
  return function (
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const err = new Error as customError;
        err.message =  result.error.issues[0].message
        
      next(err);
      return;
    }

    req.body = result.data;

    next();
  };
}