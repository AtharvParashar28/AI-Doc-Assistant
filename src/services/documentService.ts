import { HTTP_STATUS_CODE, ERROR_MESSAGES } from "../constants/apiResponse";
import { customError } from "../models/customError";
import prisma from "../config/prisma";
import { DocumentType } from "../generated/prisma/enums";
import { Pagination } from "../models/ApiResponse";
import { deleteFile, uploadFile, getFile } from "./s3.Service";

export type CreateDocumentPayload = {
    fileName: string,
    type: DocumentType,
    uploadedBy: string,
    fileBuffer: Buffer,
    storageKey?: string
}

export type UpdateDocumentPayload = {
    fileName?: string;
    storageKey?: string;
    type?: DocumentType;
}

export async function createDocument(newDocument: CreateDocumentPayload) {
    const key = await uploadDocumentToCloud(
        newDocument.fileName,
        newDocument.fileBuffer,
        newDocument.type
    );

    try {
        const document = await prisma.document.create({
            data: {
                fileName: newDocument.fileName,
                type: newDocument.type,
                uploadedBy: newDocument.uploadedBy,
                storageKey: key,
            },
        });

        return document;
    } catch (error) {
        console.error("Database save failed:", error);

        // Clean up uploaded file if database operation fails.
        try {
            await deleteDocumentFromCloud(key);
        } catch (cleanupError) {
            console.error("Storage cleanup failed:", cleanupError);
        }

        const err = new Error() as customError;
        err.message = ERROR_MESSAGES.DOCUMENT_SAVE_FAILED;
        err.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;

        throw err;
    }
}

export async function uploadDocumentToCloud(
    fileName: string,
    fileBuffer: Buffer,
    type: DocumentType
) {
    try {
        const result = await uploadFile(fileName, fileBuffer, type);
        return result.key;
    } catch (error) {
        console.error("Document upload failed:", error);

        const err = new Error() as customError;
        err.message = ERROR_MESSAGES.DOCUMENT_STORAGE_UPLOAD_FAILED;
        err.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;

        throw err;
    }
}

export async function deleteDocumentFromCloud(key: string) {
    try {
        return await deleteFile(key);
    } catch (error) {
        console.error("Document deletion failed:", error);

        const err = new Error() as customError;
        err.message = ERROR_MESSAGES.DOCUMENT_STORAGE_DELETE_FAILED;
        err.statusCode = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;

        throw err;
    }
}

export async function deleteDocumentById(documentId: string, userId: string) {
    // Retrieve a single document by ID.

    const existingDoc = await getDocumentByIdForUser(documentId, userId);

    if (!existingDoc) {
        // Document not found: throw a not-found error.
        const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND) as customError;
        error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
        throw error;
    }

    // If the document exist, delete
    const deletedDoc = await prisma.document.delete({
        where: {
            id: documentId
        }
    })

    return deletedDoc;

}

export async function getDocumentByIdForUser(documentId: string, userId: string) {
    const document = await prisma.document.findFirst({
        where: {
            id: documentId,
            uploadedBy: userId
        }
    })

    return document;
}

export async function getAllDocuments(userId: string, Page: number, Limit: number, search: string, sortBy: string, SortOrder: string) {

    // Calculating skip 
    const skip = (Page - 1) * Limit;

    const allDocuments = await prisma.document.findMany({

        where: {
            uploadedBy: userId,
            fileName: {
                contains: search,
                mode: "insensitive"
            }

        },
        orderBy: {
            [sortBy]: SortOrder
        },
        skip: skip,
        take: Limit,


    });

    return allDocuments;
}

export async function getPaginationMetadata(userId: string, Page: number, Limit: number) {
    const skip = (Page - 1) * Limit;

    const count = await prisma.document.count({
        where: {
            uploadedBy: userId
        }
    });

    const pagination: Pagination = {
        page: Page,
        limit: Limit,
        hasNextPage: (skip + Limit < count) ? true : false,
        hasPreviousPage: (skip > 0) ? true : false,
        totalRecords: count,
        totalPage: Math.ceil(count / Limit)
    }

    return pagination;
}
export async function updateDocument(documentId: string, updatedPayload: UpdateDocumentPayload, userId: string) {
    // Retrieve a single document by ID.
    // const existingDoc = await existingDocument({id : documentId});

    const existingDoc = await getDocumentByIdForUser(documentId, userId);

    if (!existingDoc) {
        // Document not found: throw a not-found error.
        const error = new Error(ERROR_MESSAGES.RESOURCE_NOT_FOUND) as customError;
        error.statusCode = HTTP_STATUS_CODE.NOT_FOUND;
        throw error;
    }


    console.log(updatedPayload);
    // If the document exist, delete
    const updatedDoc = await prisma.document.update({
        where: {
            id: documentId
        },
        data: updatedPayload
    })

    return updatedDoc;
}