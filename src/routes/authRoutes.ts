import { Router } from "express";
import { login } from "../controllers/authController";
import { validate } from "../middlewares/inputValidation.middleware";
import { loginSchema } from "../validators/auth.validator";

const route = Router();
route.post("/login", validate(loginSchema),login);

export default route;
