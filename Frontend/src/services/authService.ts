import { apiClient } from "./apiClient";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignupPayload {
    name: string;
    email: string;
    password: string;
}

export const login = (payload: LoginPayload) => {
    return apiClient.post("/auth/login", payload);
};

export const signup = (payload: SignupPayload) => {
    return apiClient.post("/auth/signup", payload);
};
