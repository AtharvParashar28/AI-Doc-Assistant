import { Request } from "express";
import { ApiResponse } from "../models/ApiResponse";
import { HTTP_STATUS_CODE, ERROR_MESSAGES, RESPONSE_STATUS, SUCCESS_MESSAGES } from "../constants/statusCode";
import { customError } from "../models/customError";
import { Document } from "../models/Document.model";
import { Documents } from "../models/Documents";

export function createDocument(documentRequest : Request): ApiResponse {
    try {
        const error = new Error() as customError;

        // Ensure the request is authenticated and `req.user` is available.
        if (!documentRequest.user) {
            error.message = ERROR_MESSAGES.INVALID_TOKEN_PAYLOAD;
            error.statusCode = HTTP_STATUS_CODE.UNAUTHORIZED;
            throw error;
        }

    
    const documentId : string = `${documentRequest.body.filename + documentRequest.body.filepath.replaceAll('/', '')}`;

        if (Documents.has(documentId)) {
            // Existing document case: return the existing record in the standard
            // ApiResponse shape rather than creating a duplicate.
            const existing = Documents.get(documentId)!;
            const result: ApiResponse = {
                status: RESPONSE_STATUS.SUCCESS,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
                data: existing,
            };
            return result;
        }

    const newDoc : Document = {
           documentId : documentId,
           uploadedBy : documentRequest.user.email,
           uploadedAt : new Date()
    }

    Documents.set(newDoc.documentId,newDoc);

    const result : ApiResponse = {
                status: RESPONSE_STATUS.SUCCESS,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
                data: newDoc,
    }

    return result;

    } catch (err) {
        // Re-throw the original error so the controller receives the actual failure.
        throw err;
    }
}

export function deleteDocumentById(documentId : string): ApiResponse {
    // Delete the document when it exists and return a standard ApiResponse.
    if (Documents.has(documentId)) {
        Documents.delete(documentId);
        const result: ApiResponse = {
            status: RESPONSE_STATUS.SUCCESS,
            message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
        };
        return result;
    }

    // If the document does not exist, throw a not-found error.
    const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND) as customError;
    error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
    throw error;
}

export function getDocumentById(documentId: string): ApiResponse {
    // Retrieve a single document by ID.
    if (!Documents.has(documentId)) {
        // Document not found: throw a not-found error.
        const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND) as customError;
        error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
        throw error;
    }

    const document = Documents.get(documentId)!;
    const result: ApiResponse = {
        status: RESPONSE_STATUS.SUCCESS,
        message: SUCCESS_MESSAGES.DATA_RETRIEVED,
        data: document,
    };
    return result;
}

export function getAllDocuments(): ApiResponse {
    // Retrieve all documents as an array.
    const allDocuments = Array.from(Documents.values());
    const result: ApiResponse = {
        status: RESPONSE_STATUS.SUCCESS,
        message: SUCCESS_MESSAGES.DATA_RETRIEVED,
        data: allDocuments,
    };
    return result;
}

export function updateDocument(documentId: string, filename: string, filepath: string, userEmail: string): ApiResponse {
    // Update an existing document's metadata.
    if (!Documents.has(documentId)) {
        // Document not found: throw a not-found error.
        const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND) as customError;
        error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
        throw error;
    }

    const existingDocument = Documents.get(documentId)!;
    const updatedDocument: Document = {
        ...existingDocument,
        uploadedBy: userEmail,
        uploadedAt: new Date(),
    };

    Documents.set(documentId, updatedDocument);

    const result: ApiResponse = {
        status: RESPONSE_STATUS.SUCCESS,
        message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
        data: updatedDocument,
    };
    return result;
}
