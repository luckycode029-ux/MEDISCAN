import { randomUUID } from "node:crypto";

export function createRequestContext(route: string, method: string) {
  const requestId = randomUUID();
  const startedAt = Date.now();
  return { route, method, requestId, startedAt };
}

export function logInfo(message: string, context: Record<string, unknown>) {
  console.log(`[api] ${message}`, context);
}

export function logError(message: string, context: Record<string, unknown>, error: unknown) {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error(`[api] ${message}`, {
    ...context,
    errorName: err.name,
    errorMessage: err.message,
    stack: err.stack,
  });
}

export function elapsedMs(startedAt: number) {
  return Date.now() - startedAt;
}

export function statusForError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const lowered = message.toLowerCase();
  if (
    lowered.includes("please upload") ||
    lowered.includes("only image files") ||
    lowered.includes("must be a pdf or image") ||
    lowered.includes("too large") ||
    lowered.includes("please provide symptoms")
  ) {
    return 400;
  }
  if (lowered.includes("timed out")) {
    return 504;
  }
  return 500;
}
