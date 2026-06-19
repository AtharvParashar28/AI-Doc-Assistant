import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { HTTP_STATUS_CODE, ERROR_MESSAGES, RESPONSE_STATUS, SUCCESS_MESSAGES } from "../constants/apiResponse";
import { customError } from "../models/customError";
import { createDocument, getAllDocuments, getDocumentByIdForUser, deleteDocumentById, updateDocument } from "../services/documentService";
import { DocumentType } from "../generated/prisma/enums";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SEARCH = "";

export async function CreateDocumentController(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {

        if (!req.user) {
            const error = new Error() as customError;
            error.message = ERROR_MESSAGES.JWT_REQUIRED;
            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
            throw error;
        }

        if (!req.body || !req.body.blobUrl || !req.body.filename || !req.body.type) {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            return next(error);
        }

        const fileObject = req.body;
        const documentType = fileObject.type;

        if (!Object.values(DocumentType).includes(documentType)) {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            return next(error);
        }

        const newDoc = {
                   fileName : fileObject.filename,
                   blobUrl : fileObject.blobUrl,
                   type : documentType,
                   uploadedBy : req.user.userId,
            }

        const result = await createDocument(newDoc);

        res.status(HTTP_STATUS_CODE.OK).json({
                status: RESPONSE_STATUS.SUCCESS,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
                data: result,
    });

    } catch (err) {
        return next(err);
    }
}

export async function GetDocumentbyID(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
        // Normalize the ID from route parameters (may be string or array).
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        // Validate that an ID was provided.
        if (!id) {
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

        // Call service to fetch the document; service throws if not found.
        const document = await getDocumentByIdForUser(id, req.user.userId);

        if (!document) {
            const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND) as customError;
            error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
            return next(error);
        }

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.DATA_RETRIEVED,
            data: document,

        });
    } catch (err) {
        return next(err);
    }
}

export async function GetDocumentsController(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
         const page = Number(req.query.page) || DEFAULT_PAGE;
         const limit = Number(req.query.limit) || DEFAULT_LIMIT;
         const search = (req.query.search as string)?.trim() || DEFAULT_SEARCH;
         
        // Check if user object is present in request body or not
        if (!req.user || !req.user.email || !req.user.userId) {
            const error = new Error(ERROR_MESSAGES.UNAUTHORIZED) as customError;
            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
            return next(error);
        }

        // Call service to fetch all documents owned by requesting user
        const documents = await getAllDocuments(req.user.userId, page, limit, search);

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.DATA_RETRIEVED,
            data: documents,
        });

    } catch (err) {
        const error = new Error(ERROR_MESSAGES.SOMETHING_WENT_WRONG) as customError;
        error.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
        return next(error);
    }
}

export async function DeleteDocumentController(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
        // If it is an array use the first element otherwise only string
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!id) {
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

        const result = await deleteDocumentById(id, req.user.userId);

        // deleteDocumentById throws if the document is not found, so a result
        // here means deletion succeeded and can be returned directly.
        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
            data: result,
        })

    } catch (err) {
        return next(err);
    }
}

export async function UpdateDocumentController(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
        // Normalize the ID from route parameters.
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        // Validate required fields: ID, filename, and filepath.
        if (!id || !req.body || typeof req.body.fileName !== 'string' || typeof req.body.blobUrl !== 'string') {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            return next(error);
        }

        // Ensure the request is authenticated.
        if (!req.user || !req.user.userId) {
            const error = new Error(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD) as customError;
            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
            return next(error);
        }

        // Call service to update the document; service throws if not found.
        const result = await updateDocument(id, req.body, req.user.userId);

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
            data: result,
        })
    } catch (err) {
        return next(err);
    }
}
