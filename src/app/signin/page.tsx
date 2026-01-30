"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const created = searchParams.get("created");
  const exists = searchParams.get("error") === "exists";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/notes");
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: "0 16px" }}>
      <h1>Sign in</h1>
      {created && <p>Account created. Please sign in.</p>}
      {exists && <p>Email already exists. Please sign in.</p>}
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" required />
        </label>
        <button type="submit">Sign in</button>
      </form>

      <p style={{ marginTop: 16 }}>
        New here? <Link href="/signup">Create an account</Link>
      </p>
    </main>
  );
}
