import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNote, deleteNote } from "./actions";

export default async function NotesPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    redirect("/signin");
  }

  const notes = await prisma.note.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", padding: "0 16px" }}>
      <h1>Your notes</h1>
      <p>
        Signed in as {email}.{" "}
        <Link href="/api/auth/signout">Sign out</Link>
      </p>

      <section style={{ marginTop: 24 }}>
        <h2>New note</h2>
        <form action={createNote} style={{ display: "grid", gap: 12 }}>
          <input name="title" placeholder="Title" required />
          <textarea name="content" placeholder="Content" rows={4} />
          <button type="submit">Add note</button>
        </form>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>All notes</h2>
        {notes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          <ul style={{ display: "grid", gap: 12, padding: 0 }}>
            {notes.map((note) => (
              <li
                key={note.id}
                style={{
                  listStyle: "none",
                  border: "1px solid #ddd",
                  padding: 12,
                }}
              >
                <strong>{note.title}</strong>
                {note.content && <p>{note.content}</p>}
                <form action={deleteNote}>
                  <input type="hidden" name="id" value={note.id} />
                  <button type="submit">Delete</button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
