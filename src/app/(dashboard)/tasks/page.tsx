"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "./tasks.module.css";
import { Plus, Trash2, CheckCircle } from "lucide-react";

type User = { id: string; name: string };
type Project = { id: string; name: string };
type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  projectId: string;
  assignedToId: string | null;
  project: Project;
  assignedTo: User | null;
  createdAt: string;
};

export default function TasksPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", projectId: "", assignedToId: "" });

  useEffect(() => {
    fetchTasks();
    if (isAdmin) {
      fetchProjects();
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    if (res.ok) setTasks(await res.json());
  };

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    if (res.ok) setProjects(await res.json());
  };

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    if (res.ok) {
      setNewTask({ title: "", description: "", projectId: "", assignedToId: "" });
      setIsCreating(false);
      fetchTasks();
    }
  };

  const updateStatus = async (taskId: string, status: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (res.ok) {
        fetchTasks();
        // Show success feedback
        console.log(`Task ${taskId} updated to ${status}`);
      } else {
        const errorData = await res.text();
        console.error('Failed to update task:', errorData);
        alert('Failed to update task. Please try again.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('An error occurred while updating the task.');
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      
      if (res.ok) {
        fetchTasks();
        console.log(`Task ${taskId} deleted successfully`);
      } else {
        const errorData = await res.text();
        console.error('Failed to delete task:', errorData);
        
        if (res.status === 401) {
          alert('You must be logged in as an admin to delete tasks.');
        } else if (res.status === 403) {
          alert('Only administrators can delete tasks.');
        } else if (res.status === 404) {
          alert('Task not found. It may have already been deleted.');
        } else {
          alert('Failed to delete task. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting the task.');
    }
  };

  const renderTasks = (status: string) => {
    return tasks.filter(t => t.status === status).map(task => (
      <div key={task.id} className={`glass-panel ${styles.taskCard}`}>
        <div className={styles.taskHeader}>
          <span className={styles.projectBadge}>{task.project.name}</span>
          {isAdmin && (
            <button className={styles.deleteBtn} onClick={() => deleteTask(task.id)}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <h4 className={styles.taskTitle}>{task.title}</h4>
        {task.description && <p className={styles.taskDesc}>{task.description}</p>}
        <div className={styles.taskFooter}>
          <div className={styles.assignee}>
            {task.assignedTo ? task.assignedTo.name : "Unassigned"}
          </div>
          <div className={styles.taskActions}>
            {isAdmin ? (
              // Admins see the dropdown select
              <select 
                value={task.status} 
                onChange={(e) => updateStatus(task.id, e.target.value)}
                className={styles.statusSelect}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            ) : (
              // Members see only the Mark as Done button (no dropdown)
              task.status !== "DONE" && (
                <button 
                  className={`btn btn-success ${styles.markDoneBtn}`}
                  onClick={() => updateStatus(task.id, "DONE")}
                  title="Mark this task as completed"
                >
                  <CheckCircle size={16} style={{ marginRight: '4px' }} />
                  Mark as Done
                </button>
              )
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tasks</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
            <Plus size={18} style={{ marginRight: '0.5rem' }} /> New Task
          </button>
        )}
      </header>

      {isCreating && isAdmin && (
        <div className={`glass-panel ${styles.createForm}`}>
          <h2>Create New Task</h2>
          <form onSubmit={handleCreate}>
            <div className={styles.inputGroup}>
              <label>Task Title</label>
              <input
                type="text"
                className="input-field"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Description</label>
              <textarea
                className="input-field"
                rows={2}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>
            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label>Project</label>
                <select 
                  className="input-field" 
                  value={newTask.projectId} 
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label>Assignee</label>
                <select 
                  className="input-field" 
                  value={newTask.assignedToId} 
                  onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" className="btn btn-outline" onClick={() => setIsCreating(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Task</button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.board}>
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.indicator} style={{ backgroundColor: "var(--warning)" }}></div>
            <h3>To Do</h3>
            <span className={styles.count}>{tasks.filter(t => t.status === "TODO").length}</span>
          </div>
          <div className={styles.taskList}>
            {renderTasks("TODO")}
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.indicator} style={{ backgroundColor: "var(--primary)" }}></div>
            <h3>In Progress</h3>
            <span className={styles.count}>{tasks.filter(t => t.status === "IN_PROGRESS").length}</span>
          </div>
          <div className={styles.taskList}>
            {renderTasks("IN_PROGRESS")}
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <div className={styles.indicator} style={{ backgroundColor: "var(--success)" }}></div>
            <h3>Done</h3>
            <span className={styles.count}>{tasks.filter(t => t.status === "DONE").length}</span>
          </div>
          <div className={styles.taskList}>
            {renderTasks("DONE")}
          </div>
        </div>
      </div>
    </div>
  );
}
