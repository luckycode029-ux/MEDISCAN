import { env } from "node:process";

export type ProviderEnvStatus = {
  name: "gemini" | "openrouter" | "groq";
  envVar: string;
  configured: boolean;
};

export function getProviderEnvStatus(): ProviderEnvStatus[] {
  return [
    { name: "gemini", envVar: "GEMINI_API_KEY", configured: Boolean(env.GEMINI_API_KEY) },
    { name: "openrouter", envVar: "OPENROUTER_API_KEY", configured: Boolean(env.OPENROUTER_API_KEY) },
    { name: "groq", envVar: "GROQ_API_KEY", configured: Boolean(env.GROQ_API_KEY) },
  ];
}

export function getEnvKey(name: "GEMINI_API_KEY" | "OPENROUTER_API_KEY" | "GROQ_API_KEY") {
  return env[name];
}
