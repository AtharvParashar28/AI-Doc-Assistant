import {Router } from "express";
import { signup} from "../controllers/authController";

const route = Router();

route.post("/signup",signup)

export default route;