import type { Route } from "./+types/api.ai-health";
import { getProviderEnvStatus } from "~/services/server/config";
import { createRequestContext, elapsedMs, logInfo } from "~/services/server/debug";

async function checkUrl(url: string, init: RequestInit) {
  try {
    const response = await fetch(url, init);
    return { ok: response.ok, status: response.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

export async function loader({}: Route.LoaderArgs) {
  const ctx = createRequestContext("/api/ai-health", "GET");
  logInfo("request.start", ctx);
  const envStatus = getProviderEnvStatus();
  logInfo("env.status", {
    ...ctx,
    providers: envStatus.map((provider) => ({ ...provider, configured: provider.configured })),
  });

  const checks = await Promise.all(
    envStatus.map(async (provider) => {
      if (!provider.configured) {
        return { provider: provider.name, configured: false, reachable: false, status: 0 };
      }

      if (provider.name === "gemini") {
        const key = process.env.GEMINI_API_KEY!;
        const res = await checkUrl(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
          { method: "GET" }
        );
        return { provider: provider.name, configured: true, reachable: res.ok, status: res.status };
      }

      if (provider.name === "openrouter") {
        const key = process.env.OPENROUTER_API_KEY!;
        const res = await checkUrl("https://openrouter.ai/api/v1/models", {
          method: "GET",
          headers: { Authorization: `Bearer ${key}` },
        });
        return { provider: provider.name, configured: true, reachable: res.ok, status: res.status };
      }

      const key = process.env.GROQ_API_KEY!;
      const res = await checkUrl("https://api.groq.com/openai/v1/models", {
        method: "GET",
        headers: { Authorization: `Bearer ${key}` },
      });
      return { provider: provider.name, configured: true, reachable: res.ok, status: res.status };
    })
  );

  const response = {
    ok: checks.some((c) => c.reachable),
    providers: checks,
    message:
      "Provider key health check complete. At least one reachable provider is required for AI responses.",
  };
  logInfo("request.end", { ...ctx, elapsedMs: elapsedMs(ctx.startedAt), ok: response.ok });
  return Response.json(response);
}
