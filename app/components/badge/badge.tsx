import classNames from "classnames";
import styles from "./badge.module.css";

interface BadgeProps {
  label: string;
  variant?: "success" | "warning" | "danger" | "info" | "purple";
  size?: "sm" | "md";
}

export function Badge({ label, variant = "info", size = "md" }: BadgeProps) {
  return (
    <span className={classNames(styles.badge, styles[variant], styles[size])}>
      {label}
    </span>
  );
}
