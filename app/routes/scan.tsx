import { useState, useRef } from "react";
import { Link } from "react-router";
import { IconArrowLeft, IconCamera, IconUpload, IconPill } from "@tabler/icons-react";
import type { Route } from "./+types/scan";
import styles from "./scan.module.css";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Scan Medicine | MediScan AI" }];
}

type ScanState = "idle" | "scanning" | "result";

type MedicineResult = {
  medicineName: string;
  analysis: {
    usage?: string[];
    precautions?: string[];
    sideEffects?: string[];
    simpleExplanation?: string;
    warningLabel?: string;
  };
  disclaimer: string;
};

const TIME_SLOTS = ["Morning", "Afternoon", "Night"];

export default function Scan() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [reminderOn, setReminderOn] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<MedicineResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event?: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    setError("");
    setScanState("scanning");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/scan-medicine", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Medicine scan failed");

      setResult(data as MedicineResult);
      setScanState("result");
    } catch (e) {
      setError((e as Error).message);
      setScanState("idle");
    }
  };

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className={styles.backBtn}>
          <IconArrowLeft size={20} />
        </Link>
        <h1 className={styles.headerTitle}>Medicine Scanner</h1>
        <p className={styles.headerSub}>Upload a photo to identify any medicine</p>
      </div>

      <div className={styles.body}>
        {scanState === "idle" && (
          <>
            <div className={styles.uploadZone} onClick={() => inputRef.current?.click()}>
              <div className={styles.scanRing}>
                <IconCamera size={32} className={styles.uploadIcon} />
              </div>
              <p className={styles.uploadTitle}>Scan Medicine Label</p>
              <p className={styles.uploadSub}>Point your camera or upload a photo of the medicine packaging</p>
              <button className={styles.uploadBtn} onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
                <IconUpload size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                Upload Photo
              </button>
              <input ref={inputRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleUpload} />
            </div>
            {error && <p className={styles.scanningSubtext}>{error}</p>}
          </>
        )}

        {scanState === "scanning" && (
          <div className={styles.scanningWrap}>
            <div className={styles.scanRing} style={{ width: 100, height: 100, borderColor: "var(--color-primary)" }}>
              <IconPill size={36} color="var(--color-primary)" />
            </div>
            <p className={styles.scanningText}>Understanding medicine...</p>
            <p className={styles.scanningSubtext}>Running OCR and AI safety checks</p>
            <div className={styles.scannerBar}>
              <div className={styles.scannerProgress} />
            </div>
          </div>
        )}

        {scanState === "result" && result && (
          <>
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div className={styles.pillIcon}>Pill</div>
                <div>
                  <h2 className={styles.medicineName}>{result.medicineName}</h2>
                </div>
              </div>
              <div className={styles.resultBody}>
                <div className={styles.infoSection}>
                  <p className={styles.infoTitle}>Simple explanation</p>
                  <p className={styles.infoItem}>{result.analysis.simpleExplanation || "No explanation available."}</p>
                </div>
                <div className={styles.infoSection}>
                  <p className={styles.infoTitle}>What it may be used for</p>
                  <ul className={styles.infoList}>
                    {(result.analysis.usage || []).map((u) => (
                      <li key={u} className={styles.infoItem}>{u}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.infoSection}>
                  <p className={styles.infoTitle}>Side effects</p>
                  <ul className={styles.infoList}>
                    {(result.analysis.sideEffects || []).map((s) => (
                      <li key={s} className={`${styles.infoItem} ${styles.warning}`}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.infoSection}>
                  <p className={styles.infoTitle}>Precautions</p>
                  <ul className={styles.infoList}>
                    {(result.analysis.precautions || []).map((p) => (
                      <li key={p} className={`${styles.infoItem} ${styles.danger}`}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.dosageBox}>
                  <p className={styles.dosageText}>{result.analysis.warningLabel || "Consult a doctor for exact dosage."}</p>
                  <p className={styles.dosageText}>{result.disclaimer}</p>
                </div>
              </div>
            </div>

            <div className={styles.reminderCard}>
              <div className={styles.reminderHeader}>
                <p className={styles.reminderTitle}>Set Dosage Reminder</p>
                <button
                  className={`${styles.toggle} ${reminderOn ? styles.on : ""}`}
                  onClick={() => setReminderOn(!reminderOn)}
                  aria-label="Toggle reminder"
                />
              </div>
              {reminderOn && (
                <div className={styles.timeSlots}>
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      className={`${styles.timeChip} ${selectedTimes.includes(t) ? styles.selected : ""}`}
                      onClick={() => toggleTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className={styles.scanAnotherBtn} onClick={() => setScanState("idle")}>
              Scan Another Medicine
            </button>
          </>
        )}
      </div>
    </div>
  );
}
