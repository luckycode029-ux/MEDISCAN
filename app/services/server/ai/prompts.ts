import { APP_DISCLAIMER, AI_SYSTEM_SAFETY_INSTRUCTION } from "../health-disclaimer";

export function medicinePrompt(extractedText: string) {
  return `${AI_SYSTEM_SAFETY_INSTRUCTION}\n\nAnalyze this medicine text from OCR: ${extractedText}\n\nReturn strict JSON with keys:\nmedicineName (string), usage (string[]), precautions (string[]), sideEffects (string[]), simpleExplanation (string), warningLabel (string).\nKeep language short and simple. Include disclaimer: ${APP_DISCLAIMER}`;
}

export function reportPrompt(extractedText: string) {
  return `${AI_SYSTEM_SAFETY_INSTRUCTION}\n\nAnalyze this health report text: ${extractedText}\n\nReturn strict JSON with keys:\nsummary (string), deficiencies (string[]), abnormalValues (string[]), naturalImprovements (string[]), doctorRecommendation (string), warningLabel (string).\nUse non-technical language and mention uncertainty where needed. Include disclaimer: ${APP_DISCLAIMER}`;
}

export function symptomsPrompt(symptomsText: string) {
  return `${AI_SYSTEM_SAFETY_INSTRUCTION}\n\nSymptoms input: ${symptomsText}\n\nReturn strict JSON with keys:\ndoctorCategory (string), possibleDirection (string), nearbyClinicType (string), guidance (string[]), urgency ("low"|"medium"|"high"), warningLabel (string).\nDo not diagnose diseases. Keep wording safe and practical. Include disclaimer: ${APP_DISCLAIMER}`;
}
