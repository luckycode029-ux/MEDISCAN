export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  uses: string[];
  sideEffects: string[];
  precautions: string[];
  dosage: string;
  color: string;
}

export const SAMPLE_MEDICINES: Medicine[] = [
  {
    id: "paracetamol",
    name: "Crocin 500mg",
    genericName: "Paracetamol",
    category: "Analgesic / Antipyretic",
    uses: ["Reduces fever", "Relieves mild to moderate pain", "Headache relief", "Body ache"],
    sideEffects: ["Nausea (rare)", "Skin rash (if allergic)", "Liver stress with high doses"],
    precautions: ["Avoid alcohol", "Do not exceed 4g per day", "Consult doctor if liver issues"],
    dosage: "500mg every 4–6 hours as needed. Max 4 tablets/day.",
    color: "#2563EB",
  },
  {
    id: "amoxicillin",
    name: "Amoxil 250mg",
    genericName: "Amoxicillin",
    category: "Antibiotic",
    uses: ["Bacterial infections", "Ear infections", "Throat infections", "UTI"],
    sideEffects: ["Diarrhea", "Nausea", "Skin rash", "Allergic reaction (rare)"],
    precautions: ["Complete the full course", "Avoid if penicillin allergy", "Take with food"],
    dosage: "250–500mg every 8 hours for 7–10 days.",
    color: "#0D9488",
  },
];
