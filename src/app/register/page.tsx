"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import styles from "../login/login.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });
  const [error, setError] = useState("");

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const errorData = await response.text();
        setError(errorData || "Something went wrong.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.formCard}`}>
        <h2 className={styles.title}>Create an Account</h2>
        <p className={styles.subtitle}>Join your team and manage tasks</p>

        <form onSubmit={registerUser} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input
              type="text"
              className="input-field"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              className="input-field"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Role</label>
            <select
              className="input-field"
              value={data.role}
              onChange={(e) => setData({ ...data, role: e.target.value })}
              required
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
            Sign Up
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className={`btn btn-outline ${styles.googleBtn}`}
        >
          <img src="https://authjs.dev/img/providers/google.svg" alt="Google" width={20} height={20} />
          Sign up with Google
        </button>

        <p className={styles.footerText}>
          Already have an account? <Link href="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
