import { HTTP_STATUS_CODE, ERROR_MESSAGES } from "../constants/apiResponse";
import { customError } from "../models/customError";
import prisma from "../config/prisma";
import { DocumentType } from "../generated/prisma/enums";
import { Pagination } from "../models/ApiResponse";
import { SortOrder } from "../generated/prisma/internal/prismaNamespace";

export type CreateDocumentPayload = {
    fileName: string;
    blobUrl: string;
    type: DocumentType;
    uploadedBy: string;
}

export type UpdateDocumentPayload = {
    fileName?: string;
    blobUrl?: string;
    type?: DocumentType;
}

export async function createDocument(newDocument : CreateDocumentPayload) {
    try {

    const document = await prisma.document.create({
            data : newDocument
    })

    return document;

    } catch (err) {
        // Re-throw the original error so the controller receives the actual failure.
        throw err;
    }
}

export async function deleteDocumentById(documentId : string, userId: string){ 
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
        where :{
            id : documentId
        }
    })

    return deletedDoc;
    
}

// export async function getDocumentById(documentId: string) {
//     // Retrieve a single document by ID.
//     const document = await prisma.document.findUnique({
//         where : {
//             id : documentId
//         }
//     })

//     return document;
// }

export async function getDocumentByIdForUser(documentId: string, userId: string) {
    const document = await prisma.document.findFirst({
        where: {
            id: documentId,
            uploadedBy: userId
        }
    })

    return document;
}

export async function getAllDocuments(userId : string, Page : number, Limit : number, search : string, sortBy : string, SortOrder : string) {

    // Calculating skip 
    const skip = (Page - 1) * Limit;

    const allDocuments = await prisma.document.findMany({
    
        where : {
            uploadedBy : userId,
            fileName : {
                contains : search,
                mode : "insensitive"
            }
            
        },
        orderBy:{
            [sortBy] : SortOrder
        },
        skip : skip,
        take : Limit,
        
        
    });

    return allDocuments;
}

export async function getPaginationMetadata ( userId : string, Page : number, Limit : number){
    const skip = (Page - 1) * Limit;

    const count = await prisma.document.count({
        where : {
            uploadedBy : userId
        }
    });

    const pagination : Pagination = {
        page : Page,
        limit : Limit,
        hasNextPage : (skip + Limit < count) ? true : false, 
        hasPreviousPage : (skip > 0) ? true : false,
        totalRecords : count,
        totalPage : Math.ceil(count/Limit)
    }

    return pagination;
}
export async function updateDocument(documentId: string, updatedPayload : UpdateDocumentPayload, userId: string){
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
        where :{
            id : documentId
        },
        data : updatedPayload
    })

    return updatedDoc;
}