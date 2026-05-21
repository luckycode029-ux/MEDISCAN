import { PDFParse } from "pdf-parse";
import { extractTextFromImage } from "./ocr/ocr.service";

export async function extractTextFromReport(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const parser = new PDFParse({ data: bytes });
    try {
      const parsed = await parser.getText();
      const text = parsed.text?.trim();
      if (text) return text;
      throw new Error("PDF has no readable text. Please upload a clearer scanned report image.");
    } finally {
      await parser.destroy();
    }
  }

  return extractTextFromImage(bytes);
}
