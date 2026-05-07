import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import styles from "./page.module.css";
import { CheckCircle, Clock, AlertCircle, Users, Calendar, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) return null;

  const isAdmin = session.user.role === "ADMIN";

  // Fetch stats
  const totalProjects = isAdmin 
    ? await prisma.project.count() 
    : await prisma.project.count({
        where: { tasks: { some: { assignedToId: session.user.id } } }
      });

  const userTasks = await prisma.task.findMany({
    where: isAdmin ? {} : { assignedToId: session.user.id },
    include: { project: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  // Enhanced statistics with overdue detection
  const stats = {
    todo: await prisma.task.count({ where: { status: "TODO", ...(isAdmin ? {} : { assignedToId: session.user.id }) } }),
    inProgress: await prisma.task.count({ where: { status: "IN_PROGRESS", ...(isAdmin ? {} : { assignedToId: session.user.id }) } }),
    done: await prisma.task.count({ where: { status: "DONE", ...(isAdmin ? {} : { assignedToId: session.user.id }) } }),
    overdue: await prisma.task.count({ 
      where: { 
        status: { in: ["TODO", "IN_PROGRESS"] },
        createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Tasks older than 7 days
        ...(isAdmin ? {} : { assignedToId: session.user.id })
      } 
    }),
  };

  // Team statistics (admin only)
  const teamStats = isAdmin ? {
    totalUsers: await prisma.user.count(),
    totalProjects: await prisma.project.count(),
    totalTasks: await prisma.task.count(),
    completedThisWeek: await prisma.task.count({
      where: {
        status: "DONE",
        updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    })
  } : null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome back, {session.user.name?.split(' ')[0]}!</h1>
        <p className={styles.subtitle}>Here is what's happening with your projects today.</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statIcon} style={{ color: "var(--warning)" }}>
            <AlertCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>To Do</h3>
            <p className={styles.statValue}>{stats.todo}</p>
          </div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statIcon} style={{ color: "var(--primary)" }}>
            <Clock size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>In Progress</h3>
            <p className={styles.statValue}>{stats.inProgress}</p>
          </div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statIcon} style={{ color: "var(--success)" }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Completed</h3>
            <p className={styles.statValue}>{stats.done}</p>
          </div>
        </div>
        <div className={`glass-panel ${styles.statCard}`}>
          <div className={styles.statIcon} style={{ color: "var(--danger)" }}>
            <Calendar size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Overdue</h3>
            <p className={styles.statValue}>{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Team Statistics for Admin */}
      {teamStats && (
        <div className={styles.teamSection}>
          <h2 className={styles.sectionTitle}>Team Overview</h2>
          <div className={styles.teamStatsGrid}>
            <div className={`glass-panel ${styles.statCard}`}>
              <div className={styles.statIcon} style={{ color: "var(--primary)" }}>
                <Users size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>Team Members</h3>
                <p className={styles.statValue}>{teamStats.totalUsers}</p>
              </div>
            </div>
            <div className={`glass-panel ${styles.statCard}`}>
              <div className={styles.statIcon} style={{ color: "var(--warning)" }}>
                <TrendingUp size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>Active Projects</h3>
                <p className={styles.statValue}>{teamStats.totalProjects}</p>
              </div>
            </div>
            <div className={`glass-panel ${styles.statCard}`}>
              <div className={styles.statIcon} style={{ color: "var(--info)" }}>
                <CheckCircle size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>Total Tasks</h3>
                <p className={styles.statValue}>{teamStats.totalTasks}</p>
              </div>
            </div>
            <div className={`glass-panel ${styles.statCard}`}>
              <div className={styles.statIcon} style={{ color: "var(--success)" }}>
                <TrendingUp size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>Completed This Week</h3>
                <p className={styles.statValue}>{teamStats.completedThisWeek}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.recentSection}>
        <h2 className={styles.sectionTitle}>Recent Tasks</h2>
        <div className={`glass-panel ${styles.tableContainer}`}>
          {userTasks.length === 0 ? (
            <div className={styles.emptyState}>No tasks assigned yet.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {userTasks.map((task) => {
                  const isOverdue = new Date(task.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && 
                                    !["DONE"].includes(task.status);
                  return (
                    <tr key={task.id}>
                      <td className={styles.taskTitle}>
                        {task.title}
                        {isOverdue && <span style={{color: 'var(--danger)', marginLeft: '8px'}}>⚠️ Overdue</span>}
                      </td>
                      <td className={styles.projectName}>{task.project.name}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[task.status.toLowerCase()]}`}>
                          {task.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className={styles.date}>{new Date(task.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
