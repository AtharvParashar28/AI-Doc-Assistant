import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email : string
}

const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
const secretKeyRaw = process.env.JWT_SECRET ;

if(!secretKeyRaw){
  throw new Error('Jwt secret is required');
}

const secretKey : string = secretKeyRaw!;

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
