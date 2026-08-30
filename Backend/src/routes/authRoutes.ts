import { Router } from "express";
import { login, generateNewToken } from "../controllers/authController";
import { validate } from "../middlewares/inputValidation.middleware";
import { loginSchema } from "../validators/auth.validator";
import { ValidationSource } from "../middlewares/inputValidation.middleware";

export const SOURCE = {
    query : "query",
    body : "body",
    params : "params"
}

const route = Router();
route.post("/login", validate(loginSchema, SOURCE.body as ValidationSource),login);
route.post("/refresh", generateNewToken);

export default route;
