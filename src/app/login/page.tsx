"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass-panel ${styles.formCard}`}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to manage your tasks</p>

        <form onSubmit={loginUser} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
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
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
            Sign In
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
          Continue with Google
        </button>

        <p className={styles.footerText}>
          Don't have an account? <Link href="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
