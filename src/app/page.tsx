import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: "0 16px" }}>
      <h1>Notes App (Next.js)</h1>
      <p>Simple notes with Prisma + Auth.js.</p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/signup">Create account</Link>
        <Link href="/signin">Sign in</Link>
        <Link href="/notes">Go to notes</Link>
      </div>
    </main>
  );
}
