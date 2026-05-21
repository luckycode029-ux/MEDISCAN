export type ParsedMetric = {
  name: string;
  value: string;
  unit: string;
};

const METRIC_REGEX = /([A-Za-z][A-Za-z\s]+)\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*([a-zA-Z%\/]+)/g;

export function parseReportMetrics(text: string): ParsedMetric[] {
  const metrics: ParsedMetric[] = [];
  for (const match of text.matchAll(METRIC_REGEX)) {
    metrics.push({
      name: match[1].trim(),
      value: match[2].trim(),
      unit: match[3].trim(),
    });
  }

  return metrics.slice(0, 20);
}
