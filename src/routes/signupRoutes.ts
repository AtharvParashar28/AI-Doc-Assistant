import {Router } from "express";
import { signup} from "../controllers/authController";
import { validate } from "../middlewares/inputValidation.middleware";
import { signupSchema } from "../validators/auth.validator";

const route = Router();

route.post("/signup",validate(signupSchema), signup)

export default route;