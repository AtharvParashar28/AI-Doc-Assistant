// This is the Ingestion service
// Document -> text extraction -> chunking -> embedding -> Store in DB

import { extractTextFromPdf } from "./textExtractionService";
import { generateEmbeddings } from "./embeddingService";
import { createChunks } from "./chunkingService";
import { Prisma } from "../generated/prisma/client";
import prisma from "../config/prisma";
import { createId } from "@paralleldrive/cuid2";


const chunkSize = 20;
const overlapSize = 5;

export async function ingestionPipeline(
    docId: string,
    storageKey: string,
    tx: Prisma.TransactionClient
): Promise<void> {
    console.log("========== INGESTION PIPELINE STARTED ==========");
    console.log("Document Id:", docId);

    // Step 1 - Extract text
    const text = await extractTextFromPdf(storageKey);
    console.log("Text extracted successfully.");

    // Step 2 - Create chunks
    const chunks = createChunks(text, {
        chunkSize,
        overlapSize,
    });

    console.log(`Total chunks created: ${chunks.length}`);

    // Step 3 - Generate embeddings
    const chunkContents = chunks.map((chunk) => chunk.content);

    const embeddings = await generateEmbeddings(chunkContents);

    console.log(`Embeddings generated: ${embeddings.length}`);

    // Validation
    if (chunks.length !== embeddings.length) {
        throw new Error(
            `Chunk count (${chunks.length}) does not match embedding count (${embeddings.length})`
        );
    }

    console.log("Mapping chunks with embeddings...");

    const values = chunks.map((chunk, index) => {
        const vector = `[${embeddings[index].join(",")}]`;

        return Prisma.sql`
        (
            ${createId()},
            ${docId},
            ${chunk.chunkIndex},
            ${chunk.content},
            ${vector}::vector
        )
        `;
    });

    console.log(`Prepared ${values.length} SQL rows.`);

    console.log("Saving chunks to database...");

    try {
        const result = await tx.$executeRaw`
            INSERT INTO "DocumentChunk"
            (
                "id",
                "documentId",
                "chunkIndex",
                "content",
                "embedding"
            )
            VALUES ${Prisma.join(values)}
        `;

        console.log("Insert Result:", result);
        console.log("========== INGESTION COMPLETED ==========");
    } catch (error) {
        console.error("========== INGESTION FAILED ==========");
        console.error(error);
        throw error;
    }
}