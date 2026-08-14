import { Router } from "express";
import { chatController, messageController } from "../controllers/aiController";
import { validate } from "../middlewares/inputValidation.middleware";
import { generateSchema, getChatParamsSchema } from "../validators/ai.validator";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getDocumentsParamSchema } from "../validators/document.validator";

const route = Router();

route.post('/chat/:chatId/message', authMiddleware, validate(getChatParamsSchema,"query"), validate(generateSchema, "body"), messageController);
route.post('/document/:documentId/chat',authMiddleware, validate(getDocumentsParamSchema,"query"), chatController);


export default route;