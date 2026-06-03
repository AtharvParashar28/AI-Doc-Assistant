import { verifyToken } from "../services/authService";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../models/ApiResponse";

/**
 * Authentication middleware
 * - Parses `Authorization` header expecting `Bearer <token>`
 * - Verifies token and attaches decoded payload to `req.user`
 *
 * Teaching notes:
 * - Always validate header shape before splitting to avoid runtime errors.
 * - Use `401` for authentication failures (missing/invalid token).
 * - Avoid logging sensitive headers in production.
 * - Prefer extending Express.Request to type `req.user`; a simple cast is used here for brevity.
 */
export function authMiddleware(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    // Read the Authorization header (may be undefined)
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        // No Authorization header present
        return res.status(401).json({
            status: "failed",
            description: "Access Denied: No Authorization header",
        });
    }

    // Header should be in form: "Bearer <token>"
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) {
        return res.status(401).json({
            status: "failed",
            description: "Access Denied: Invalid Authorization format",
        });
    }

    const token = match[1].trim();

    try {
        // verifyToken should throw if token is invalid or expired
        const decoded = verifyToken(token);

        // Attach payload to typed request object.
        req.user = decoded;

        return next();
    } catch (err) {
        // Keep error messages generic to avoid leaking details
        return res.status(401).json({
            status: "failed",
            description: "Access Denied: Invalid or expired token",
        });
    }
}