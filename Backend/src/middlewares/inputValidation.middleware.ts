import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { customError } from "../models/customError";

export type ValidationSource = "body" | "query" | "params";

export function validate(
  schema: ZodSchema,
  source: ValidationSource
) {
  return function (
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const validationTarget = req[source];

    const result = schema.safeParse(validationTarget);

    if (!result.success) {
      const err = new Error() as customError;
      err.message = result.error.issues[0].message;

      next(err);
      return;
    }

    console.log(result.data);

    if(source === "body") req[source] = result.data;

    next();
  };
}