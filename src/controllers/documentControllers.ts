import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { HTTP_STATUS_CODE, ERROR_MESSAGES, RESPONSE_STATUS } from "../constants/statusCode";
import { customError } from "../models/customError";
import { createDocument, deleteDocumentById, getDocumentById, getAllDocuments, updateDocument, documentOwnershipCheck } from "../services/documentService";

export function CreateDocumentController(req : Request, res : Response<ApiResponse>, next : NextFunction){
    try {
        if(!req.body || !req.body.filepath || !req.body.filename){
        const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
        error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
        return next(error);
    }

    // Calling document creation service; the service returns an ApiResponse
    // for both new documents and already-existing documents.
    const result = createDocument(req);

    // No need to throw here: createDocument will either return a valid ApiResponse
    // or throw a service error that gets handled by the catch block.
    res.status(HTTP_STATUS_CODE.OK).json(result);

    } catch (err) {
        const error = new Error(ERROR_MESSAGES.SOMETHING_WENT_WRONG) as customError;
        error.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
        return next(error);
    }
}

export function documentById(req : Request, res : Response<ApiResponse>, next : NextFunction) {
    try {
        // Normalize the ID from route parameters (may be string or array).
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        // Validate that an ID was provided.
        if (!id) {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            return next(error);
        }

        // Check if user is authorized to edit requested document or not

        console.log("Checking owner-ship")
        if(documentOwnershipCheck(req,id)){
             // Call service to fetch the document; service throws if not found.
            const result : ApiResponse = getDocumentById(id);
            return res.status(HTTP_STATUS_CODE.OK).json(result);
        }
              
        }

    catch (err) {
        return next(err);
    }
}

export function documents(req : Request, res : Response<ApiResponse>, next : NextFunction) {
    try {
        // Call service to fetch all documents.
        const result = getAllDocuments();

        return res.status(HTTP_STATUS_CODE.OK).json(result);
    } catch (err) {
        const error = new Error(ERROR_MESSAGES.SOMETHING_WENT_WRONG) as customError;
        error.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
        return next(err);
    }
}

export function deleteDocumentController(req : Request, res : Response<ApiResponse>, next : NextFunction) {
    try {
        // If it is an array use the first element otherwise only string
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!id) {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            return next(error);
        }

        const result = deleteDocumentById(id);

        // deleteDocumentById throws if the document is not found, so a result
        // here means deletion succeeded and can be returned directly.
        res.status(HTTP_STATUS_CODE.OK).json(result);

    } catch (err) {
        return next(err);
    }
}

export function updateDocumentById(req : Request, res : Response<ApiResponse>, next : NextFunction) {
    try {
        // Normalize the ID from route parameters.
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        // Validate required fields: ID, filename, and filepath.
        if (!id || !req.body || typeof req.body.filename !== 'string' || typeof req.body.filepath !== 'string') {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            return next(error);
        }

        // Ensure the request is authenticated.
        if (!req.user) {
            const error = new Error(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD) as customError;
            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
            return next(error);
        }

        // Call service to update the document; service throws if not found.
        const result = updateDocument(id, req.body.filename, req.body.filepath, req.user.email);

        return res.status(HTTP_STATUS_CODE.OK).json(result);
    } catch (err) {
        return next(err);
    }
}
