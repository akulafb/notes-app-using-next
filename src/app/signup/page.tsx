"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push("/signin?created=1");
      return;
    }

    if (response.status === 409) {
      router.push("/signin?error=exists");
      return;
    }

    const data = await response.json().catch(() => null);
    setError(data?.message ?? "Sign up failed. Please try again.");
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: "0 16px" }}>
      <h1>Create account</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" minLength={6} required />
        </label>
        <button type="submit">Create account</button>
      </form>

      <p style={{ marginTop: 16 }}>
        Have an account? <Link href="/signin">Sign in</Link>
      </p>
    </main>
  );
}
