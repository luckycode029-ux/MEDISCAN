import { generateWithFallback } from "./providers";
import { medicinePrompt, reportPrompt, symptomsPrompt } from "./prompts";

export async function analyzeMedicineWithAI(ocrText: string) {
  return generateWithFallback(medicinePrompt(ocrText));
}

export async function analyzeReportWithAI(reportText: string) {
  return generateWithFallback(reportPrompt(reportText));
}

export async function analyzeSymptomsWithAI(symptomsText: string) {
  return generateWithFallback(symptomsPrompt(symptomsText));
}
