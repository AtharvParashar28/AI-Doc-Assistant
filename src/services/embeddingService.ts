import axios from "axios";

const EMBEDDING_ENDPOINT = process.env.EMBEDDING_MODEL_ENDPOINT!;
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL!;

type EmbeddingResponse = {
    embeddings: number[][];
};

export async function generateEmbeddings(
    texts: string[]
): Promise<number[][]> {
    // Validate input
    if (texts.length === 0) {
        throw new Error("No text provided for embedding generation.");
    }

    if (texts.some(text => !text.trim())) {
        throw new Error("Input contains empty text.");
    }

    try {
        const { data } = await axios.post<EmbeddingResponse>(
            EMBEDDING_ENDPOINT,
            {
                model: EMBEDDING_MODEL,
                input: texts,
            }
        );

        if (!Array.isArray(data.embeddings)) {
            throw new Error("Invalid response received from embedding model.");
        }

        return data.embeddings;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `Failed to generate embeddings: ${error.message}`
            );
        }

        throw error;
    }
}