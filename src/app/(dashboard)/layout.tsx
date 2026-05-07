"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, FolderKanban, CheckSquare, ShieldAlert } from "lucide-react";
import styles from "./dashboard.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === "loading") {
    return <div className={styles.loader}>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Team Tasker</h2>
        </div>
        <nav className={styles.navLinks}>
          <Link href="/dashboard" className={`${styles.navItem} ${pathname === "/dashboard" ? styles.active : ""}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/tasks" className={`${styles.navItem} ${pathname.startsWith("/tasks") ? styles.active : ""}`}>
            <CheckSquare size={20} /> My Tasks
          </Link>
          {isAdmin && (
            <Link href="/projects" className={`${styles.navItem} ${pathname.startsWith("/projects") ? styles.active : ""}`}>
              <FolderKanban size={20} /> Projects
            </Link>
          )}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{session?.user?.name?.[0] || "U"}</div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{session?.user?.name}</span>
              <span className={styles.userRole}>
                {isAdmin && <ShieldAlert size={12} />} {session?.user?.role}
              </span>
            </div>
          </div>
          <button onClick={() => signOut()} className={styles.logoutBtn}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
