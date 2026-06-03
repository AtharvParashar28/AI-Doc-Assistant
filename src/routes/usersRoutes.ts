import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getCurrentUser } from "../controllers/authController";

const route = Router();

// Protected route: returns information about the authenticated user
route.get("/users", authMiddleware, getCurrentUser);

export default route;
