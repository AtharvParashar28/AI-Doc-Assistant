import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { createUser, loginUser } from "../services/createUser";
import { Users } from "../models/Users";
import { customError } from "../models/customError";
import { HTTP_STATUS_CODE, ERROR_MESSAGES, RESPONSE_STATUS, SUCCESS_MESSAGES } from "../constants/statusCode";


export async function signup(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    const payload = req.body;

    try {

        if (!payload.email || !payload.password) {
            const error = new Error(ERROR_MESSAGES.INVALID_CREDENTIALS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            throw error;
        }

        const token = await createUser(payload);

        return res.status(HTTP_STATUS_CODE.CREATED).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.USER_CREATED,
            data: { token },
        });

    } catch (err) {
        const error = new Error(ERROR_MESSAGES.INVALID_CREDENTIALS) as customError;
        error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
        next(error);
    }
}

export async function login(req: Request, res: Response<ApiResponse>) {
    const payload = req.body;
    try {

        if (!payload.email || !payload.password) {
            const error = new Error(ERROR_MESSAGES.INVALID_CREDENTIALS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            throw error;
        }

        const token = await loginUser(payload);

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.USER_LOGGED_IN,
            data: { token },
        });
    } catch (err) {
        const error = new Error(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD) as customError;
        error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
        throw error;
    }
}

export async function getCurrentUser(req: Request, res: Response<ApiResponse>, next : NextFunction) {
    try {
        const email = req.user?.email;

        if (!email) {
            const error = new Error(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD) as customError;
            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
            throw error;
        }

        const user = Users.get(email);
        if (!user) {
            const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND) as customError;
            error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
            throw error;
        }

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.USER_FETCHED,
            data: {
                email: user.email,
            },
        });
    } catch (error) {
        next(error)
    }
}
