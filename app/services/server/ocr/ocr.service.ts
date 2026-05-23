import { preprocessImageForOcr } from "./image-preprocess";

export function cleanOcrText(raw: string) {
  return raw
    .replace(/[^\x20-\x7E\n]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export async function extractTextFromImage(buffer: Buffer) {
  const Tesseract = (await import("tesseract.js")).default;
  const preprocessed = await preprocessImageForOcr(buffer);
  const { data } = await Tesseract.recognize(preprocessed, "eng", {
    logger: () => {
      // Keep logger disabled here to avoid noisy server logs in demo mode.
    },
  });

  const text = cleanOcrText(data.text || "");
  if (!text) {
    throw new Error("Could not extract text. Try a clearer photo with better lighting.");
  }

  return text;
}
