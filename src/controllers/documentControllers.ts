import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { HTTP_STATUS_CODE, ERROR_MESSAGES, RESPONSE_STATUS, SUCCESS_MESSAGES } from "../constants/statusCode";
import { customError } from "../models/customError";
import { Document } from "../models/document.model";
import { Documents } from "../models/Documents";

export function createDocument(req : Request, res : Response<ApiResponse>, next : NextFunction){
    try {
        if(!req.body || !req.body.filepath || !req.body.filename){
        const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
        error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
        return next(error);
    }

    
    if(!req.user){
        return ;
    }

    const documentId : string = `${req.body.filename + req.body.filepath.replaceAll('/', '')}`;

    const newDoc : Document = {
           documentId : documentId,
           uploadedBy : req.user.email,
           uploadedAt : new Date()
    }

    Documents.set(newDoc.documentId,newDoc);

    res.status(HTTP_STATUS_CODE.CREATED).json({
        status : RESPONSE_STATUS.SUCCESS,
        message : SUCCESS_MESSAGES.OPERATION_SUCCESS,
        data : newDoc
    })

    } catch (err) {
        const error = new Error(ERROR_MESSAGES.SOMETHING_WENT_WRONG) as customError;
        error.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
        return next(error);
    }
}

export function documentById(req : Request, res : Response<ApiResponse>, next : NextFunction) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!id) {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            return next(error);
        }

        const document = Documents.get(id);
        if (!document) {
            const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND) as customError;
            error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
            return next(error);
        }

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.DATA_RETRIEVED,
            data: document
        });
    } catch (err) {
        const error = new Error(ERROR_MESSAGES.SOMETHING_WENT_WRONG) as customError;
        error.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
        return next(error);
    }
}

export function documents(req : Request, res : Response<ApiResponse>, next : NextFunction) {
    try {
        const allDocuments = Array.from(Documents.values());

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.DATA_RETRIEVED,
            data: allDocuments
        });
    } catch (err) {
        const error = new Error(ERROR_MESSAGES.SOMETHING_WENT_WRONG) as customError;
        error.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
        return next(error);
    }
}

export function deleteDocumentById(req : Request, res : Response<ApiResponse>, next : NextFunction) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!id) {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            return next(error);
        }

        if (!Documents.has(id)) {
            const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND) as customError;
            error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
            return next(error);
        }

        Documents.delete(id);

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
        });
    } catch (err) {
        const error = new Error(ERROR_MESSAGES.SOMETHING_WENT_WRONG) as customError;
        error.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
        return next(error);
    }
}

export function updateDocumentById(req : Request, res : Response<ApiResponse>, next : NextFunction) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

        if (!id || !req.body || typeof req.body.filename !== 'string' || typeof req.body.filepath !== 'string') {
            const error = new Error(ERROR_MESSAGES.MISSING_FIELDS) as customError;
            error.statusCode = HTTP_STATUS_CODE.BAD_REQUEST;
            return next(error);
        }

        if (!req.user) {
            const error = new Error(ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD) as customError;
            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
            return next(error);
        }

        const existingDocument = Documents.get(id);
        if (!existingDocument) {
            const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND) as customError;
            error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
            return next(error);
        }

        const updatedDocument: Document = {
            ...existingDocument,
            uploadedBy: req.user.email,
            uploadedAt: new Date(),
        };

        Documents.set(id, updatedDocument);

        return res.status(HTTP_STATUS_CODE.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
            data: updatedDocument
        });
    } catch (err) {
        const error = new Error(ERROR_MESSAGES.SOMETHING_WENT_WRONG) as customError;
        error.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
        return next(error);
    }
}
