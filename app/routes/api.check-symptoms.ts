import type { Route } from "./+types/api.check-symptoms";
import { analyzeSymptomsWithAI } from "~/services/server/ai/ai.service";
import { APP_DISCLAIMER } from "~/services/server/health-disclaimer";
import { withTimeout } from "~/services/server/safety";

export async function action({ request }: Route.ActionArgs) {
  try {
    const body = (await request.json()) as { symptoms?: string };
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
    return Response.json(
      {
        error: (error as Error).message,
        disclaimer: APP_DISCLAIMER,
      },
      { status: 400 }
    );
  }
}
