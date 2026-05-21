import styles from "./health-score.module.css";

interface HealthScoreProps {
  score: number;
  label: string;
}

export function HealthScore({ score, label }: HealthScoreProps) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#16A34A" : score >= 60 ? "#D97706" : "#DC2626";

  return (
    <div className={styles.container}>
      <svg className={styles.ring} viewBox="0 0 100 100" width={110} height={110}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className={styles.center}>
        <span className={styles.score} style={{ color }}>{score}</span>
        <span className={styles.pct}>/ 100</span>
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
