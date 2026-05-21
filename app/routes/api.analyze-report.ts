import type { Route } from "./+types/api.analyze-report";
import { analyzeReportWithAI } from "~/services/server/ai/ai.service";
import { APP_DISCLAIMER } from "~/services/server/health-disclaimer";
import { parseReportMetrics } from "~/services/server/parsers/report-parser";
import { extractTextFromReport } from "~/services/server/report-text.service";
import { assertAllowedReportFile, withTimeout } from "~/services/server/safety";

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const file = formData.get("report");

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
    return Response.json(
      {
        error: (error as Error).message,
        disclaimer: APP_DISCLAIMER,
      },
      { status: 400 }
    );
  }
}
