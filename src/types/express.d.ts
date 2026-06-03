import type { JwtPayload } from "../services/authService";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
