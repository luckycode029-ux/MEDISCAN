import { env } from "node:process";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export type ProviderName = "gemini" | "openrouter" | "groq";

function parseJsonLike(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  }
}

async function callGemini(prompt: string) {
  if (!env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
  const response = await fetch(`${GEMINI_URL}?key=${env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 700 },
    }),
  });

  if (!response.ok) throw new Error(`Gemini failed (${response.status})`);
  const data = (await response.json()) as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty text");
  return parseJsonLike(text);
}

async function callOpenRouter(prompt: string) {
  if (!env.OPENROUTER_API_KEY) throw new Error("Missing OPENROUTER_API_KEY");
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://mediscan.local",
      "X-Title": "MediScan AI",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`OpenRouter failed (${response.status})`);
  const data = (await response.json()) as any;
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenRouter returned empty text");
  return parseJsonLike(text);
}

async function callGroq(prompt: string) {
  if (!env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Groq failed (${response.status})`);
  const data = (await response.json()) as any;
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq returned empty text");
  return parseJsonLike(text);
}

export async function generateWithFallback(prompt: string) {
  const errors: string[] = [];

  for (const provider of ["gemini", "openrouter", "groq"] as ProviderName[]) {
    try {
      const result =
        provider === "gemini"
          ? await callGemini(prompt)
          : provider === "openrouter"
            ? await callOpenRouter(prompt)
            : await callGroq(prompt);

      if (!result || typeof result !== "object") {
        throw new Error(`${provider} returned invalid JSON`);
      }

      return { provider, result };
    } catch (error) {
      errors.push(`${provider}: ${(error as Error).message}`);
    }
  }

  throw new Error(`All providers failed. ${errors.join(" | ")}`);
}
