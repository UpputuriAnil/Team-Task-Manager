"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "./projects.module.css";
import { Plus, Folder } from "lucide-react";

// Helper function to check if project is overdue
function isProjectOverdue(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

type Project = {
  id: string;
  name: string;
  description: string;
  deadline: string | null;
  _count: { tasks: number };
};

export default function ProjectsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", deadline: "" });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });

    if (res.ok) {
      setNewProject({ name: "", description: "", deadline: "" });
      setIsCreating(false);
      fetchProjects();
    }
  };

  if (!isAdmin) {
    return <div className={styles.container}>You do not have permission to view this page.</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Project
        </button>
      </header>

      {isCreating && (
        <div className={`glass-panel ${styles.createForm}`}>
          <h2>Create New Project</h2>
          <form onSubmit={handleCreate}>
            <div className={styles.inputGroup}>
              <label>Project Name</label>
              <input
                type="text"
                className="input-field"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea
                className="input-field"
                rows={3}
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Project Deadline</label>
              <input
                type="date"
                className="input-field"
                value={newProject.deadline}
                onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className={styles.formActions}>
              <button type="button" className="btn btn-outline" onClick={() => setIsCreating(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Project</button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.grid}>
        {projects.map((project) => (
          <div key={project.id} className={`glass-panel ${styles.projectCard}`}>
            <div className={styles.projectIcon}>
              <Folder size={24} color="var(--primary)" />
            </div>
            <div className={styles.projectInfo}>
              <h3>{project.name}</h3>
              <p>{project.description || "No description provided."}</p>
              {project.deadline && (
                <div className={styles.projectDeadline}>
                  <span className={styles.deadlineLabel}>Deadline:</span>
                  <span className={`${styles.deadlineValue} ${isProjectOverdue(project.deadline) ? styles.overdue : ''}`}>
                    {new Date(project.deadline).toLocaleDateString()}
                    {isProjectOverdue(project.deadline) && ' ⚠️ Overdue'}
                  </span>
                </div>
              )}
            </div>
            <div className={styles.projectStats}>
              <span>{project._count.tasks} Tasks</span>
            </div>
          </div>
        ))}
        {projects.length === 0 && !isCreating && (
          <div className={styles.emptyState}>No projects found. Create one to get started.</div>
        )}
      </div>
    </div>
  );
}
