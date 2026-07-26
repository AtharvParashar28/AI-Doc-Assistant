import fs from "node:fs/promises";
import { PDFParse } from "pdf-parse";
import path from "node:path";

export async function extractTextFromPdf(filePath: string): Promise<string> {
  try {
    const pdfBuffer = await fs.readFile(filePath);

    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
}

// const filePath = path.join(
//   process.cwd(),
//   "src",
//   "test-documents",
//   "Atharv_Parashar_July.pdf"
// );

// async function run (){
//     const result = await extractTextFromPdf(filePath);
//     console.log(result);
// }

// run();

