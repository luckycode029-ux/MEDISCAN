import { PDFParse } from "pdf-parse";
import { extractTextFromImage } from "./ocr/ocr.service";

export async function extractTextFromReport(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const parser = new PDFParse({ data: bytes });
    const parsed = await parser.getText();
    await parser.destroy();

    const text = parsed.text?.trim();
    if (text) return text;
    throw new Error("PDF has no readable text. Please upload a clearer scanned report image.");
  }

  return extractTextFromImage(bytes);
}
