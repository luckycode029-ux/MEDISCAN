import type { Route } from "./+types/api.check-symptoms";
import { analyzeSymptomsWithAI } from "~/services/server/ai/ai.service";
import { createRequestContext, elapsedMs, logError, logInfo, statusForError } from "~/services/server/debug";
import { APP_DISCLAIMER } from "~/services/server/health-disclaimer";
import { withTimeout } from "~/services/server/safety";

export async function action({ request }: Route.ActionArgs) {
  const ctx = createRequestContext("/api/check-symptoms", request.method);
  logInfo("request.start", ctx);

  try {
    const body = (await request.json()) as { symptoms?: string };
    logInfo("request.input", { ...ctx, hasSymptoms: Boolean(body?.symptoms?.trim()) });
    if (!body?.symptoms?.trim()) {
      return Response.json({ error: "Please provide symptoms." }, { status: 400 });
    }

    const aiResult = await withTimeout(
      analyzeSymptomsWithAI(body.symptoms),
      12000,
      "AI analysis timed out. Please try again."
    );

    return Response.json({
      aiProviderUsed: aiResult.provider,
      analysis: aiResult.result,
      disclaimer: APP_DISCLAIMER,
    });
  } catch (error) {
    logError("request.failed", { ...ctx, elapsedMs: elapsedMs(ctx.startedAt) }, error);
    const status = statusForError(error);
    return Response.json(
      {
        error: "Symptom analysis failed. Please try again.",
        details: (error as Error).message,
        disclaimer: APP_DISCLAIMER,
      },
      { status }
    );
  } finally {
    logInfo("request.end", { ...ctx, elapsedMs: elapsedMs(ctx.startedAt) });
  }
}
