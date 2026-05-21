import { useState } from "react";
import { Link } from "react-router";
import { IconArrowLeft, IconCloudUpload, IconFileAnalytics } from "@tabler/icons-react";
import type { Route } from "./+types/health-report";
import styles from "./report.module.css";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Health Report | MediScan AI" }];
}

type ReportState = "idle" | "processing" | "result";

const PROCESSING_STEPS = [
  "Reading report structure...",
  "Extracting health metrics...",
  "Simplifying medical language...",
  "Generating safe health guidance...",
];

export default function HealthReport() {
  const [state, setState] = useState<ReportState>("idle");
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setState("processing");
    setStep(0);

    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, PROCESSING_STEPS.length));
    }, 700);

    const formData = new FormData();
    formData.append("report", file);

    try {
      const response = await fetch("/api/analyze-report", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Report analysis failed");
      setResult(data);
      setState("result");
    } catch (e) {
      setError((e as Error).message);
      setState("idle");
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>
          <IconArrowLeft size={20} />
        </Link>
        <h1 className={styles.headerTitle}>Health Report</h1>
        <p className={styles.headerSub}>Upload your medical report for AI analysis</p>
      </div>

      <div className={styles.body}>
        {state === "idle" && (
          <label className={styles.uploadZone}>
            <div className={styles.uploadIconWrap}>
              <IconCloudUpload size={32} />
            </div>
            <p className={styles.uploadTitle}>Upload Medical Report</p>
            <p className={styles.uploadSub}>PDF, JPG, or PNG</p>
            <div className={styles.uploadTypes}>
              <span className={styles.typeTag}>PDF</span>
              <span className={styles.typeTag}>JPG</span>
              <span className={styles.typeTag}>PNG</span>
            </div>
            <span className={styles.uploadBtn}>Choose File</span>
            <input type="file" accept="application/pdf,image/*" className={styles.hiddenInput} onChange={handleUpload} />
            {error ? <p className={styles.processingStep}>{error}</p> : null}
          </label>
        )}

        {state === "processing" && (
          <div className={styles.processingWrap}>
            <div className={styles.processingIcon}>
              <IconFileAnalytics size={36} color="var(--color-secondary)" />
            </div>
            <p className={styles.processingText}>Analyzing report...</p>
            <div className={styles.processingBar}>
              <div className={styles.processingProgress} />
            </div>
            <div className={styles.processingSteps}>
              {PROCESSING_STEPS.slice(0, step).map((item) => (
                <p key={item} className={styles.processingStep}>[ok] {item}</p>
              ))}
            </div>
          </div>
        )}

        {state === "result" && result ? (
          <>
            <h2 className={styles.sectionTitle}>Simple Summary</h2>
            <div className={styles.suggestionCard}>
              <p className={styles.metricExplanation}>{result.analysis?.summary || "No summary available."}</p>
              <p className={styles.normalRange}>{result.disclaimer}</p>
            </div>

            <h2 className={styles.sectionTitle}>Extracted Metrics</h2>
            <div className={styles.metricsList}>
              {(result.metrics || []).map((m: any, idx: number) => (
                <div key={`${m.name}-${idx}`} className={styles.metricRow}>
                  <div className={styles.metricTop}>
                    <span className={styles.metricName}>{m.name}</span>
                    <div className={styles.metricVal}>
                      <span className={styles.metricValue}>{m.value}</span>
                      <span className={styles.metricUnit}>{m.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className={styles.sectionTitle}>Deficiencies and Abnormal Clues</h2>
            <div className={styles.suggestionCard}>
              <p className={styles.conditionTitle}>Deficiencies</p>
              {(result.analysis?.deficiencies || []).map((d: string) => (
                <p key={d} className={styles.tipDetail}>- {d}</p>
              ))}
              <p className={styles.conditionTitle}>Abnormal Values</p>
              {(result.analysis?.abnormalValues || []).map((a: string) => (
                <p key={a} className={styles.tipDetail}>- {a}</p>
              ))}
            </div>

            <h2 className={styles.sectionTitle}>Natural Improvements</h2>
            <div className={styles.suggestionCard}>
              {(result.analysis?.naturalImprovements || []).map((n: string) => (
                <p key={n} className={styles.tipDetail}>- {n}</p>
              ))}
              <p className={styles.conditionSpecialist}>Consult: {result.analysis?.doctorRecommendation}</p>
            </div>

            <button className={styles.uploadAnotherBtn} onClick={() => setState("idle")}>Upload Another Report</button>
          </>
        ) : null}
      </div>
    </div>
  );
}
