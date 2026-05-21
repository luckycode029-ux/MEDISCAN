import { Outlet } from "react-router";
import { BottomNav } from "~/components/bottom-nav/bottom-nav";
import styles from "./app-shell.module.css";

export default function AppShell() {
  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
