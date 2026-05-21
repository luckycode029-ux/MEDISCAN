export interface ReportMetric {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: "normal" | "low" | "high";
  explanation: string;
}

export interface HealthReport {
  id: string;
  name: string;
  date: string;
  score: number;
  scoreLabel: string;
  metrics: ReportMetric[];
  suggestions: WellnessSuggestion[];
}

export interface WellnessSuggestion {
  id: string;
  condition: string;
  icon: string;
  tips: { label: string; detail: string }[];
  specialist: string;
}

export const SAMPLE_REPORT: HealthReport = {
  id: "report-001",
  name: "Complete Blood Count",
  date: "May 15, 2025",
  score: 68,
  scoreLabel: "Needs Attention",
  metrics: [
    { name: "Hemoglobin", value: "13.2", unit: "g/dL", normalRange: "13.5–17.5", status: "low", explanation: "Slightly low. You may feel tired or short of breath easily." },
    { name: "Vitamin D", value: "18", unit: "ng/mL", normalRange: "20–50", status: "low", explanation: "Low Vitamin D can cause fatigue, bone pain, and low mood." },
    { name: "Blood Sugar", value: "95", unit: "mg/dL", normalRange: "70–100", status: "normal", explanation: "Your blood sugar is in the healthy range. Great!" },
    { name: "Cholesterol", value: "210", unit: "mg/dL", normalRange: "<200", status: "high", explanation: "Slightly elevated. Reduce fried foods and increase physical activity." },
    { name: "Platelet Count", value: "250", unit: "K/µL", normalRange: "150–400", status: "normal", explanation: "Normal range. Your blood clotting function is healthy." },
    { name: "TSH", value: "2.1", unit: "mIU/L", normalRange: "0.4–4.0", status: "normal", explanation: "Thyroid function is working normally." },
  ],
  suggestions: [
    {
      id: "vitamin-d",
      condition: "Low Vitamin D",
      icon: "🌞",
      specialist: "General Physician",
      tips: [
        { label: "Morning Sunlight", detail: "15–20 mins of sun exposure before 10am" },
        { label: "Egg Yolk", detail: "Rich in natural Vitamin D3" },
        { label: "Fatty Fish", detail: "Salmon, mackerel, and tuna are excellent sources" },
        { label: "Fortified Milk", detail: "A glass of fortified milk daily" },
      ],
    },
    {
      id: "cholesterol",
      condition: "High Cholesterol",
      icon: "🫀",
      specialist: "Cardiologist",
      tips: [
        { label: "Oats & Fiber", detail: "Soluble fiber reduces cholesterol absorption" },
        { label: "Olive Oil", detail: "Replace butter with heart-healthy olive oil" },
        { label: "Daily Walk", detail: "30 mins brisk walking reduces LDL" },
        { label: "Avoid Fried Foods", detail: "Cut down on saturated and trans fats" },
      ],
    },
  ],
};
