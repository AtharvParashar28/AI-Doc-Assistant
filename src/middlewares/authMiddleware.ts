import { verifyToken } from "../services/authService";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { HTTP_STATUS_CODE, ERROR_MESSAGES } from "../constants/statusCode";
import { customError } from "../models/customError";

// interface CustomAuthError extends Error {
//   statusCode?: number;
// }

/**
 * Authentication middleware
 * - Parses `Authorization` header expecting `Bearer <token>`
 * - Verifies token and attaches decoded payload to `req.user`
 * - Delegates failures to the global error handler.
 */
export function authMiddleware(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        const error = new Error(ERROR_MESSAGES.UNAUTHORIZED) as customError;
        error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
        throw error;
      }

    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      const error = new Error(ERROR_MESSAGES.INVALID_AUTH_FORMAT) as customError;
      error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
      throw error;
    }

    const token = match[1].trim();

        // verifyToken should throw if token is invalid or expired
        const decoded = verifyToken(token);

        // Attach payload to typed request object.
        req.user = decoded;

        return next();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(ERROR_MESSAGES.INVALID_TOKEN);
    const authError = error as customError;
    if (!authError.statusCode) {
      authError.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
    }
    return next(authError);
  }
}