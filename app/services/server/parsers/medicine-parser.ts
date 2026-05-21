const NAME_REGEX = /([A-Z][a-zA-Z]+(?:\s+[A-Za-z]+)*\s+\d{2,4}\s?(?:mg|ml|mcg)?)/;

export function detectMedicineName(text: string) {
  const firstLine = text.split("\n").find(Boolean) || "";
  return firstLine.match(NAME_REGEX)?.[1]?.trim() || firstLine.trim() || "Unknown medicine";
}
