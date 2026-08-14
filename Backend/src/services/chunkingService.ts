export type ChunkConfig = {
    chunkSize: number;
    overlapSize: number;
};

export type Chunk = {
    chunkIndex: number;
    content: string;
};

export function createChunks(
    extractedText: string,
    config: ChunkConfig
): Chunk[] {
    const { chunkSize, overlapSize } = config;

    if (!extractedText.trim()) {
        return [];
    }

    if (chunkSize <= 0) {
        throw new Error("Chunk size must be greater than 0.");
    }

    if (overlapSize < 0) {
        throw new Error("Overlap size cannot be negative.");
    }

    if (overlapSize >= chunkSize) {
        throw new Error("Overlap size must be smaller than chunk size.");
    }

    // Normalize whitespace
    const words = extractedText.trim().split(/\s+/);

    const chunks: Chunk[] = [];

    const step = chunkSize - overlapSize;

    for (
        let start = 0, chunkIndex = 0;
        start < words.length;
        start += step, chunkIndex++
    ) {
        const content = words
            .slice(start, start + chunkSize)
            .join(" ");

        chunks.push({
            chunkIndex,
            content,
        });
    }

    return chunks;
}