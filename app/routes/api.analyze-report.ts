import type { Route } from "./+types/api.analyze-report";
import { analyzeReportWithAI } from "~/services/server/ai/ai.service";
import { createRequestContext, elapsedMs, logError, logInfo } from "~/services/server/debug";
import { APP_DISCLAIMER } from "~/services/server/health-disclaimer";
import { parseReportMetrics } from "~/services/server/parsers/report-parser";
import { extractTextFromReport } from "~/services/server/report-text.service";
import { assertAllowedReportFile, withTimeout } from "~/services/server/safety";

export async function action({ request }: Route.ActionArgs) {
  const ctx = createRequestContext("/api/analyze-report", request.method);
  logInfo("request.start", ctx);

  try {
    const formData = await request.formData();
    const file = formData.get("report");
    logInfo("request.input", {
      ...ctx,
      hasReport: file instanceof File,
      fileType: file instanceof File ? file.type : null,
      fileSize: file instanceof File ? file.size : null,
    });

    if (!(file instanceof File)) {
      return Response.json({ error: "Please upload your report file." }, { status: 400 });
    }
    assertAllowedReportFile(file);

    const extractedText = await withTimeout(
      extractTextFromReport(file),
      22000,
      "Report parsing timed out. Please upload a smaller or clearer report."
    );
    const metrics = parseReportMetrics(extractedText);
    const aiResult = await withTimeout(
      analyzeReportWithAI(extractedText),
      15000,
      "AI analysis timed out. Please try again."
    );

    return Response.json({
      extractedText,
      metrics,
      aiProviderUsed: aiResult.provider,
      analysis: aiResult.result,
      disclaimer: APP_DISCLAIMER,
    });
  } catch (error) {
    logError("request.failed", { ...ctx, elapsedMs: elapsedMs(ctx.startedAt) }, error);
    return Response.json(
      {
        error: "Report analysis failed. Please retry with a smaller/clearer PDF or image.",
        details: (error as Error).message,
        disclaimer: APP_DISCLAIMER,
      },
      { status: 500 }
    );
  } finally {
    logInfo("request.end", { ...ctx, elapsedMs: elapsedMs(ctx.startedAt) });
  }
}
