import { PDFParse } from "pdf-parse";
import { getFile } from "./s3.Service";

export async function extractTextFromPdf(storageKey : string) : Promise<string> {
  try {
    // download document from cloud and return extracted text

    const pdfBuffer = await getFile(storageKey);
    
    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;

  } catch (error) {
    throw new Error(`Failed to extract text from PDF`);
  }
}

