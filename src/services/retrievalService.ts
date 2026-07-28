/**
 * Retrieves the most relevant chunks from a document
 * for a given user question using semantic search.
 */

import prisma from "../config/prisma";
import { generateEmbeddings } from "./embeddingService";

const TOP_K = 5;

type RetrievedChunk = {
    content: string;
};

export async function retrieveRelevantChunks(
    userQuestion: string,
    documentId: string
): Promise<string[]> {

    // Generate embedding for the user's question
    const [queryEmbedding] = await generateEmbeddings([userQuestion]);

    // Perform semantic search
    const chunks = await semanticSearch(queryEmbedding, documentId);

    // Return only the chunk content
    return chunks.map(chunk => chunk.content);
}

async function semanticSearch(
    queryEmbedding: number[],
    documentId: string
): Promise<RetrievedChunk[]> {

    const vector = `[${queryEmbedding.join(",")}]`;

    return prisma.$queryRaw<RetrievedChunk[]>`
        SELECT
            "content"
        FROM "DocumentChunk"
        WHERE "documentId" = ${documentId}
        ORDER BY "embedding" <=> ${vector}::vector
        LIMIT ${TOP_K};
    `;
}