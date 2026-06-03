import bcrypt from 'bcrypt';
import { UserData } from '../models/UserData';
import { Users } from '../models/Users';
import { generateToken } from './authService';

export async function createUser(user: UserData) {

    if (Users.has(user.email)) {
        throw new Error('User already exists');
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
        throw new Error('User not found');
    }

    const passwordMatches = await bcrypt.compare(user.password, existingUser.password);
    if (!passwordMatches) {
        throw new Error('Invalid credentials');
    }

    return generateToken({ email: existingUser.email });
}
