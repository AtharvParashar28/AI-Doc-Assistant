import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  email: string;
  // If you later add a stable identifier, put it here
  // userId?: string;
}

const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
const secretKey = process.env.JWT_SECRET || 'defaulter';

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(
    payload,
    secretKey,
    {
      expiresIn,
    } as SignOptions,
  );
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, secretKey) as JwtPayload;
}
