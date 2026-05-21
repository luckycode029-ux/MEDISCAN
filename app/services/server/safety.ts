export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_REPORT_BYTES = 6 * 1024 * 1024;

export function assertAllowedImageFile(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are supported for medicine scanning.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large. Please upload an image under 4 MB.");
  }
}

export function assertAllowedReportFile(file: File) {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isImage = file.type.startsWith("image/");

  if (!isPdf && !isImage) {
    throw new Error("Report must be a PDF or image file.");
  }
  if (file.size > MAX_REPORT_BYTES) {
    throw new Error("Report file is too large. Please upload a file under 6 MB.");
  }
}

export async function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  let timeout: NodeJS.Timeout | undefined;
  const timer = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error(message)), ms);
  });

  try {
    return await Promise.race([promise, timer]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
