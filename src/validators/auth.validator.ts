import z from "zod";
import { ERROR_MESSAGES } from "../constants/statusCode";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, ERROR_MESSAGES.NAME_MIN_LENGTH)
    .max(50, ERROR_MESSAGES.NAME_MAX_LENGTH),

  email: z
    .email(ERROR_MESSAGES.EMAIL_INVALID),

  password: z
    .string()
    .min(8, ERROR_MESSAGES.PASSWORD_MIN_LENGTH)
    .max(100, ERROR_MESSAGES.PASSWORD_MAX_LENGTH),
}).strict();

export const loginSchema = z.object({
     email: z
    .email("Invalid email format"),

  password: z
    .string()
    .min(1, "Password is required")
})
