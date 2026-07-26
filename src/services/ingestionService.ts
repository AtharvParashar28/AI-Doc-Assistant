// This is the Ingestion service
// Document -> text extraction -> chunking & Indexing -> embedding -> Store in db

import { extractTextFromPdf } from "./textExtractionService";
import { generateEmbeddings } from "./embeddingService";
import { createChunks } from "./chunkingService";

export function IngestionPipeline(documentId : string){
    /*
    pipeline flow (Input => documentId)
    1) extractTextFromPdf -> download document content using docId and return extracted text
    2) createChunks -> create chunks and indexes from the extracted text
    3) generateEmbeddings -> generate embeddings of the chunks
    4) map chunks -> index -> embeddings and store in db
    */
 
}