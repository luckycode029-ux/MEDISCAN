import type { Route } from "./+types/api.scan-medicine";
import { analyzeMedicineWithAI } from "~/services/server/ai/ai.service";
import { APP_DISCLAIMER } from "~/services/server/health-disclaimer";
import { extractTextFromImage } from "~/services/server/ocr/ocr.service";
import { detectMedicineName } from "~/services/server/parsers/medicine-parser";

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return Response.json({ error: "Please upload an image file." }, { status: 400 });
    }

    const ocrText = await extractTextFromImage(Buffer.from(await file.arrayBuffer()));
    const medicineName = detectMedicineName(ocrText);
    const aiResult = await analyzeMedicineWithAI(ocrText);

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
      { status: 500 }
    );
  }
}
