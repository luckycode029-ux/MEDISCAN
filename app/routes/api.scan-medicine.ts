import type { Route } from "./+types/api.scan-medicine";
import { analyzeMedicineWithAI } from "~/services/server/ai/ai.service";
import { APP_DISCLAIMER } from "~/services/server/health-disclaimer";
import { extractTextFromImage } from "~/services/server/ocr/ocr.service";
import { detectMedicineName } from "~/services/server/parsers/medicine-parser";
import { assertAllowedImageFile, withTimeout } from "~/services/server/safety";

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return Response.json({ error: "Please upload an image file." }, { status: 400 });
    }
    assertAllowedImageFile(file);

    const ocrText = await withTimeout(
      extractTextFromImage(Buffer.from(await file.arrayBuffer())),
      18000,
      "Image processing took too long. Try a smaller or clearer image."
    );
    const medicineName = detectMedicineName(ocrText);
    const aiResult = await withTimeout(
      analyzeMedicineWithAI(ocrText),
      15000,
      "AI analysis timed out. Please try again."
    );

    return Response.json({
      extractedText: ocrText,
      medicineName,
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
