import { useState } from "react";
import { Link } from "react-router";
import { IconArrowLeft, IconMicrophone, IconSparkles } from "@tabler/icons-react";
import type { Route } from "./+types/symptoms";
import styles from "./symptoms.module.css";
import { SYMPTOM_CHIPS } from "~/data/symptoms";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Symptom Checker | MediScan AI" }];
}

type CheckState = "input" | "analyzing" | "result";

const URGENCY_ICONS = { low: "OK", medium: "Alert", high: "Priority" };

export default function Symptoms() {
  const [state, setState] = useState<CheckState>("input");
  const [symptomText, setSymptomText] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const analyze = async () => {
    const text = [symptomText.trim(), ...selectedChips].filter(Boolean).join(", ");
    if (!text) return;

    setState("analyzing");
    setError("");

    try {
      const response = await fetch("/api/check-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Symptom analysis failed");

      setResult(data);
      setState("result");
    } catch (e) {
      setError((e as Error).message);
      setState("input");
    }
  };

  const reset = () => {
    setState("input");
    setSymptomText("");
    setSelectedChips([]);
    setResult(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>
          <IconArrowLeft size={20} />
        </Link>
        <h1 className={styles.headerTitle}>Symptom Checker</h1>
        <p className={styles.headerSub}>Describe how you are feeling for AI analysis</p>
      </div>

      <div className={styles.body}>
        {state === "input" && (
          <>
            <div className={styles.inputCard}>
              <div className={styles.inputHeader}>
                <p className={styles.inputTitle}>How are you feeling?</p>
                <button className={styles.voiceBtn} aria-label="Voice input">
                  <IconMicrophone size={18} />
                </button>
              </div>
              <textarea
                className={styles.textarea}
                placeholder="Describe symptoms... e.g., skin itching and acne"
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
              />
              <div className={styles.inputFooter}>
                <button
                  className={styles.analyzeBtn}
                  onClick={analyze}
                  disabled={!symptomText.trim() && selectedChips.length === 0}
                >
                  <IconSparkles size={16} />
                  Analyze Symptoms
                </button>
              </div>
              {error && <p className={styles.chipsTitle}>{error}</p>}
            </div>

            <div>
              <p className={styles.chipsTitle}>Common symptoms, tap to add</p>
              <div className={styles.chips}>
                {SYMPTOM_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    className={`${styles.chip} ${selectedChips.includes(chip) ? styles.selected : ""}`}
                    onClick={() => toggleChip(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {state === "analyzing" && (
          <div className={styles.analyzingWrap}>
            <div className={styles.brainIcon}>AI</div>
            <p className={styles.analyzingText}>Analyzing symptoms safely...</p>
            <div className={styles.analyzingBar}>
              <div className={styles.analyzingProgress} />
            </div>
          </div>
        )}

        {state === "result" && result?.analysis && (
          <>
            <div className={`${styles.urgencyBanner} ${styles[result.analysis.urgency || "medium"]}`}>
              <span className={styles.urgencyIcon}>{URGENCY_ICONS[(result.analysis.urgency || "medium") as "low" | "medium" | "high"]}</span>
              <p className={`${styles.urgencyText} ${styles[result.analysis.urgency || "medium"]}`}>
                {result.analysis.warningLabel}
              </p>
            </div>

            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <p className={styles.specialistLabel}>Recommended Specialist</p>
                <h2 className={styles.specialistName}>{result.analysis.doctorCategory}</h2>
              </div>
              <div className={styles.resultBody}>
                <p className={styles.causesTitle}>Possible Healthcare Direction</p>
                <div className={styles.causesList}>
                  <div className={styles.causeItem}>{result.analysis.possibleDirection}</div>
                  {(result.analysis.guidance || []).map((g: string) => (
                    <div key={g} className={styles.causeItem}>{g}</div>
                  ))}
                </div>
                <Link to="/find-care" className={styles.bookBtn}>
                  Visit Nearby {result.analysis.nearbyClinicType} {"->"}
                </Link>
                <p className={styles.specialistLabel}>{result.disclaimer}</p>
              </div>
            </div>

            <button className={styles.resetBtn} onClick={reset}>
              Check Different Symptoms
            </button>
          </>
        )}
      </div>
    </div>
  );
}
