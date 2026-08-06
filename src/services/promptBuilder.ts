import { retrieveRelevantChunks } from "./retrievalService";

export async function promptBuilder(
    userQuestion: string,
    documentId: string
): Promise<string> {

    const relevantChunks = await retrieveRelevantChunks(
        userQuestion,
        documentId
    );

    return `
You are a helpful AI assistant.

Answer the user's question using only the information provided in the context below.

If the answer cannot be found in the context, respond with:
"I couldn't find the answer in the provided document."

Context:
${relevantChunks.join("\n\n")}

Question:
${userQuestion}

Answer:
`;
}