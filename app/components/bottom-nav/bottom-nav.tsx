import { NavLink } from "react-router";
import {
  IconHome,
  IconPill,
  IconFileAnalytics,
  IconStethoscope,
} from "@tabler/icons-react";
import styles from "./bottom-nav.module.css";

const NAV_ITEMS = [
  { to: "/", icon: IconHome, label: "Home" },
  { to: "/scan", icon: IconPill, label: "Scan" },
  { to: "/report", icon: IconFileAnalytics, label: "Report" },
  { to: "/find-care", icon: IconStethoscope, label: "Find Care" },
];

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              [styles.item, isActive ? styles.active : ""].join(" ")
            }
          >
            <div className={styles.iconWrap}>
              <Icon size={22} stroke={1.8} />
            </div>
            <span className={styles.label}>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
