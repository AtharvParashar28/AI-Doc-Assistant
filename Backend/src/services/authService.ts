import jwt, { SignOptions } from "jsonwebtoken";

export type TokenType = "ACCESS" | "REFRESH";

export interface TokenPayload {
    userId: string;
    email: string;
    type: TokenType;
}

// Access token configuration
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || "5m";
const rawAccessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;

// Refresh token configuration
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
const rawRefreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;

if (!rawAccessTokenSecretKey || !rawRefreshTokenSecretKey) {
    throw new Error("JWT secret is required");
}

const accessTokenSecretKey: string = rawAccessTokenSecretKey;
const refreshTokenSecretKey: string = rawRefreshTokenSecretKey;

function getTokenConfig(type: TokenType) {
    if (type === "ACCESS") {
        return {
            secret: accessTokenSecretKey,
            expiresIn: accessTokenExpiresIn,
        };
    }

    return {
        secret: refreshTokenSecretKey,
        expiresIn: refreshTokenExpiresIn,
    };
}

export function generateToken(payload: TokenPayload): string {
    const { secret, expiresIn } = getTokenConfig(payload.type);

    return jwt.sign(
        payload,
        secret,
        { expiresIn } as SignOptions
    );
}

export function verifyToken(
    token: string,
    type: TokenType
): TokenPayload {
    const { secret } = getTokenConfig(type);

    return jwt.verify(token, secret) as TokenPayload;
}
