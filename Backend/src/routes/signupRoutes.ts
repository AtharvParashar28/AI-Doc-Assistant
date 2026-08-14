import {Router } from "express";
import { signup} from "../controllers/authController";
import { validate } from "../middlewares/inputValidation.middleware";
import { signupSchema } from "../validators/auth.validator";
import { ValidationSource } from "../middlewares/inputValidation.middleware";

export const SOURCE = {
    query : "query",
    body : "body",
    params : "params"
}
const route = Router();

route.post("/signup",validate(signupSchema, SOURCE.body as ValidationSource), signup)

export default route;