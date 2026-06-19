import bcrypt from 'bcrypt';
import { UserData } from '../models/User.model';
import { generateToken } from './authService';
import { customError } from '../models/customError';
import { HTTP_STATUS_CODE, ERROR_MESSAGES } from '../constants/apiResponse';
import prisma from '../config/prisma';

export async function createUser(user: UserData) {

    try {
        // Check if user already present or not need to move it to utilize db layer
        const existingUser = await isUserExist(user.email);

        if (existingUser) {
            const error = new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS) as customError;
            error.statusCode = HTTP_STATUS_CODE.CONFLICT;
            throw error;
        }

        const saltrounds = Number(process.env.SALT_ROUNDS!);

        const passwordHash = await bcrypt.hash(user.password, Number(saltrounds))

        const newUser = {
            name: user.name,
            email: user.email,
            password: passwordHash
        }

        const userCreationResult = await prisma.user.create(
            {
                data: newUser
            }
        )

        // store user data and generate a token

        const token = generateToken({ userId: userCreationResult.id, email: userCreationResult.email });

        return token;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export async function loginUser(user: UserData) {
    // Check if user is available in db or not
    const existingUser = await isUserExist(user.email);

    if (!existingUser) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND) as customError;
        error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
        throw error;
    }

    // Verify the user
    const passwordMatches = await bcrypt.compare(user.password, existingUser.password);

    if (!passwordMatches) {
        const error = new Error(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD) as customError;
        error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
        throw error;
    }

    return generateToken({ userId: existingUser.id, email: existingUser.email });
}

export async function isUserExist(email: string) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    return existingUser;
}

export async function getUserbyID(id: string) {
    const user = prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return user;
}

export async function getUsers() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    });
    return users;
}
