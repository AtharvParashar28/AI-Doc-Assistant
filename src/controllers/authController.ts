import { Request, Response } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { createUser, loginUser } from "../services/createUser";
import { Users } from "../models/Users";

const UserCreated = "User created successfully";
const UserExist = "User already exist";
const InvalidCredentials = "Invalid credentials";
const LoggedIn = "User successfully logged in";
const InvalidLogin = "Invalid email or password";
const UserNotFound = "User does not exist";
const UserFetched = "Authenticated user data retrieved";

export async function signup(req: Request, res: Response<ApiResponse>) {
    const payload = req.body;

    if (!payload.email || !payload.password) {
        return res.status(400).json({
            status: "failed",
            description: InvalidCredentials,
        });
    }

    try {
        const token = await createUser(payload);
        return res.status(200).json({
            status: "success",
            description: UserCreated,
            data: { token },
        });
    } catch (err) {
        return res.status(409).json({
            status: "failed",
            description: UserExist,
        });
    }
}

export async function login(req: Request, res: Response<ApiResponse>) {
    const payload = req.body;

    if (!payload.email || !payload.password) {
        return res.status(400).json({
            status: "failed",
            description: InvalidCredentials,
        });
    }

    try {
        const token = await loginUser(payload);
        return res.status(200).json({
            status: "success",
            description: LoggedIn,
            data: { token },
        });
    } catch (err) {
        return res.status(401).json({
            status: "failed",
            description: InvalidLogin,
        });
    }
}

export async function getCurrentUser(req: Request, res: Response<ApiResponse>) {
    const email = req.user?.email;

    if (!email) {
        return res.status(401).json({
            status: "failed",
            description: "Invalid token payload",
        });
    }

    const user = Users.get(email);
    if (!user) {
        return res.status(404).json({
            status: "failed",
            description: UserNotFound,
        });
    }

    return res.status(200).json({
        status: "success",
        description: UserFetched,
        data: {
            email: user.email,
        },
    });
}
