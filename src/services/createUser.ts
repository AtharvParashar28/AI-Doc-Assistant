import bcrypt from 'bcrypt';
import { UserData } from '../models/UserData';
import { Users } from '../models/Users';
import { generateToken } from './authService';
import { customError } from '../models/customError';
import { HTTP_STATUS_CODE, ERROR_MESSAGES, RESPONSE_STATUS, SUCCESS_MESSAGES } from '../constants/statusCode';

export async function createUser(user: UserData) {

    if (Users.has(user.email)) {
        const error = new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS) as customError;
        error.statusCode = HTTP_STATUS_CODE.CONFLICT;
        throw error;
    }

    const saltrounds = 10;
    const passwordHash = await bcrypt.hash(user.password, saltrounds)

    const newUser = {
        email: user.email,
        password: passwordHash
    }

    Users.set(
        user.email,
        newUser
    )

    // store user data and generate a token
    const token = generateToken({ email: user.email });

    return token;
}

export async function loginUser(user: UserData) {
    const existingUser = Users.get(user.email);
    if (!existingUser) {
        const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND) as customError;
        error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
        throw error;
    }

    const passwordMatches = await bcrypt.compare(user.password, existingUser.password);
    if (!passwordMatches) {
        const error = new Error(ERROR_MESSAGES.INVALID_EMAIL_OR_PASSWORD) as customError;
        error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
        throw error;
    }

    return generateToken({ email: existingUser.email });
}
