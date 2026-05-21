export interface SymptomResult {
  symptoms: string[];
  possibleCauses: string[];
  recommendedSpecialist: string;
  urgency: "low" | "medium" | "high";
  urgencyNote: string;
}

export const SYMPTOM_CHIPS = [
  "Headache", "Fever", "Cough", "Fatigue", "Skin rash",
  "Chest pain", "Nausea", "Joint pain", "Back pain", "Sore throat",
  "Dizziness", "Breathlessness", "Stomach ache", "Itching", "Acne",
];

export const SYMPTOM_RESULTS: Record<string, SymptomResult> = {
  default: {
    symptoms: [],
    possibleCauses: ["Viral infection", "Fatigue or stress", "Nutritional deficiency"],
    recommendedSpecialist: "General Physician",
    urgency: "low",
    urgencyNote: "Your symptoms appear mild. A routine consultation is recommended.",
  },
  skin: {
    symptoms: ["Skin rash", "Itching", "Acne"],
    possibleCauses: ["Skin allergy", "Dermatitis", "Hormonal imbalance", "Contact irritation"],
    recommendedSpecialist: "Dermatologist",
    urgency: "low",
    urgencyNote: "Skin conditions are usually manageable. See a dermatologist soon.",
  },
  cardiac: {
    symptoms: ["Chest pain", "Breathlessness", "Dizziness"],
    possibleCauses: ["Cardiac arrhythmia", "Hypertension", "Anxiety", "Pulmonary issue"],
    recommendedSpecialist: "Cardiologist",
    urgency: "high",
    urgencyNote: "Chest symptoms need immediate attention. Please consult today.",
  },
};
