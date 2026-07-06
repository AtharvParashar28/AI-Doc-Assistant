import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { generateResponse, storeMessages } from "../services/aiService";
import { getDocumentByIdForUser } from "../services/documentService";
import { HTTP_STATUS_CODE, RESPONSE_STATUS, SUCCESS_MESSAGES } from "../constants/apiResponse";
import { ERROR_MESSAGES } from "../constants/apiResponse";
import { customError } from "../models/customError";
import { createChat } from "../services/aiService";

export async function chatController(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
        // first check document ownership
        //    Create a new chat
        // store in db and return the chat id
        // Normalize the ID from route parameters (may be string or array).
        const documentId = Array.isArray(req.params.documentId) ? req.params.documentId[0] : req.params.documentId;

        // Validate that an ID was provided.
        if (!documentId) {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            return next(error);
        }

        // Check if user object is present in request body or not
        if (!req.user || !req.user.email || !req.user.userId) {
            const error = new Error(ERROR_MESSAGES.UNAUTHORIZED) as customError;
            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
            return next(error);
        }

        const document = await getDocumentByIdForUser(documentId, req.user?.userId);

        if (!document) {
            const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND) as customError;
            error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
            return next(error);
        }

        const chat = {
            documentId : documentId,
            title : req.body.title
        }

        const newChat = await createChat(chat, documentId);

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.DATA_RETRIEVED,
            data: newChat,

        });

    }

    catch (error) {
        next(error);
    }
}

export async function messageController(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
        // Send user given prompt to geneare service.
        // req -> prompt + chatId
        try {
             // Check if user object is present in request body or not
        if (!req.user || !req.user.email || !req.user.userId) {
            const error = new Error(ERROR_MESSAGES.UNAUTHORIZED) as customError;
            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
            return next(error);
        }

            const prompt = req.body.content;
            const chatId = Array.isArray(req.params.chatId) ? req.params[0] : req.params.chatId;

            const aiResponse = await generateResponse(prompt, chatId, req.user.userId);

            return res.status(HTTP_STATUS_CODE.OK).json({
                status: RESPONSE_STATUS.SUCCESS,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
                data: aiResponse
            });
        } catch (error) {
            next(error);
        }
        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
            data: []
        });
    } catch (error) {
        next(error);
    }
}
