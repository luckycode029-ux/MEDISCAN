import { Link } from "react-router";
import {
  IconSearch,
  IconCamera,
  IconFileText,
  IconMoodSmile,
  IconMapPin,
  IconStar,
  IconChevronRight,
  IconHeart,
} from "@tabler/icons-react";
import type { Route } from "./+types/home";
import styles from "./home.module.css";
import { CLINICS } from "~/data/clinics";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MediScan AI - Your Health Companion" },
    { name: "description", content: "AI-powered health companion for medicine scanning, report analysis, and finding care." },
  ];
}

const QUICK_ACTIONS = [
  {
    to: "/scan",
    icon: "💊",
    gradient: "var(--gradient-primary)",
    title: "Scan Medicine",
    desc: "Identify any medicine instantly",
  },
  {
    to: "/report",
    icon: "📋",
    gradient: "var(--gradient-report)",
    title: "Upload Report",
    desc: "Analyze blood tests & reports",
  },
  {
    to: "/symptoms",
    icon: "🤒",
    gradient: "var(--gradient-symptom)",
    title: "Check Symptoms",
    desc: "Describe & get AI insights",
  },
  {
    to: "/find-care",
    icon: "🏥",
    gradient: "var(--gradient-care)",
    title: "Find Care",
    desc: "Nearby clinics & specialists",
  },
];

export default function Home() {
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroTop}>
          <div>
            <p className={styles.greeting}>{timeGreeting} 👋</p>
            <h1 className={styles.userName}>Arjun Kumar</h1>
          </div>
          <div className={styles.avatarBtn}>A</div>
        </div>
        <div className={styles.searchBar}>
          <IconSearch size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search medicines, symptoms..."
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Health Summary Card */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryInfo}>
          <h3>Health Overview</h3>
          <p>Last updated May 15, 2025</p>
        </div>
        <div className={styles.summaryStats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>68</span>
            <span className={styles.statLabel}>Score</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>2</span>
            <span className={styles.statLabel}>Alerts</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
        </div>
        <div className={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.to} to={action.to} className={styles.actionCard}>
              <div className={styles.actionIcon} style={{ background: action.gradient }}>
                {action.icon}
              </div>
              <div>
                <p className={styles.actionTitle}>{action.title}</p>
                <p className={styles.actionDesc}>{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Insights */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Insights</h2>
          <Link to="/report" className={styles.seeAll}>View all</Link>
        </div>
        <div className={styles.insightCard}>
          <div className={styles.insightHeader}>
            <div className={styles.insightIconWrap}>
              <IconHeart size={22} />
            </div>
            <div>
              <p className={styles.insightTitle}>Blood Test Results</p>
              <p className={styles.insightSubtitle}>May 15, 2025 · 6 metrics</p>
            </div>
          </div>
          <div className={styles.insightMetrics}>
            <div className={`${styles.metricChip} ${styles.low}`}>
              <span className={styles.dot} />
              Vitamin D Low
            </div>
            <div className={`${styles.metricChip} ${styles.high}`}>
              <span className={styles.dot} />
              Cholesterol High
            </div>
            <div className={`${styles.metricChip} ${styles.normal}`}>
              <span className={styles.dot} />
              Blood Sugar OK
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Clinics */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nearby Clinics</h2>
          <Link to="/find-care" className={styles.seeAll}>See all</Link>
        </div>
        <div className={styles.clinicList}>
          {CLINICS.slice(0, 3).map((clinic) => (
            <Link key={clinic.id} to="/find-care" className={styles.clinicCard}>
              <div
                className={styles.clinicAvatar}
                style={{ background: clinic.imageColor }}
              >
                {clinic.name[0]}
              </div>
              <div className={styles.clinicInfo}>
                <p className={styles.clinicName}>{clinic.name}</p>
                <div className={styles.clinicMeta}>
                  <span className={styles.clinicRating}>
                    <IconStar size={12} fill="currentColor" />
                    {clinic.rating}
                  </span>
                  <span className={styles.clinicDist}>
                    <IconMapPin size={12} /> {clinic.distance}
                  </span>
                </div>
              </div>
              <span className={`${styles.openBadge} ${clinic.isOpen ? styles.open : styles.closed}`}>
                {clinic.isOpen ? "Open" : "Closed"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
