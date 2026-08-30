import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { createUser, loginUser, getUserbyID } from "../services/userService";
import { customError } from "../models/customError";
import { HTTP_STATUS_CODE, ERROR_MESSAGES, RESPONSE_STATUS, SUCCESS_MESSAGES } from "../constants/apiResponse";
import { generateToken, verifyToken } from "../services/authService";

export async function signup(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    const payload = req.body;

    try {
        if (!payload.email || !payload.password || !payload.name) {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            throw error;
        }

        const {accessToken, refreshToken} = await createUser(payload);


        res.cookie('refreshToken', refreshToken, {httpOnly : true, maxAge : 7 * 24 * 60 * 60 * 1000, path : '/api/auth/refresh'})

        return res.status(HTTP_STATUS_CODE.CREATED).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.USER_CREATED,
            data: { accessToken },
        });

    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    const payload = req.body;
    try {

        if (!payload.email || !payload.password) {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            throw error;
        }

        const {accessToken, refreshToken} = await loginUser(payload);

        res.cookie('refreshToken', refreshToken, {httpOnly : true, maxAge : 7 * 24 * 60 * 60 * 1000, path : '/api/auth/refresh'})

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.USER_LOGGED_IN,
            data: { accessToken },
        });
    } catch (err) {
        next(err);
    }
}

export async function getCurrentUser(req: Request, res: Response<ApiResponse>, next : NextFunction) {
    try {
        // req.user -> extended user object => {userId , email}
        const id = req.user?.userId;

        if (!id) {
            const error = new Error(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD) as customError;
            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
            throw error;
        }

        const currerntUser = await getUserbyID(id);

        if (!currerntUser) {
            const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND) as customError;
            error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
            throw error;
        }

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.USER_FETCHED,
            data: currerntUser
        });
    } catch (error) {
        next(error)
    }
}

export async function generateNewToken(
    req: Request,
    res: Response<ApiResponse>,
    next: NextFunction
) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            const error = new Error(
                "Refresh token not found"
            ) as customError;

            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;

            throw error;
        }

        // Verify refresh token
        const payload = verifyToken(refreshToken, "REFRESH");

        // Additional token purpose validation
        if (payload.type !== "REFRESH") {
            const error = new Error(
                "Invalid refresh token"
            ) as customError;

            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;

            throw error;
        }

        // Generate new access token using verified payload
        const accessToken = generateToken({
            userId: payload.userId,
            email: payload.email,
            type: "ACCESS",
        });

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: "New access token generated",
            data: {
                accessToken,
            },
        });

    } catch (error) {
        next(error);
    }
}
