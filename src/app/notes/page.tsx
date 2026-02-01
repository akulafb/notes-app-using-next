import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNote, deleteNote, reindexNotes } from "./actions";
import { RAGSearch } from "./components/rag-search";
import { RAGChat } from "./components/rag-chat";

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-foreground dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Your notes
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Signed in as {email}.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/api/auth/signout">Sign out</Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.9fr]">
          <div className="space-y-6">
            <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
              <CardHeader>
                <CardTitle>New note</CardTitle>
                <CardDescription>
                  Capture an idea and keep it safe.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={createNote} className="grid gap-4">
                  <Input name="title" placeholder="Title" required />
                  <Textarea name="content" placeholder="Content" rows={5} />
                  <Button type="submit" className="justify-self-start">
                    Add note
                  </Button>
                </form>
              </CardContent>
            </Card>

            <RAGSearch />
            <RAGChat />
            <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
              <CardHeader>
                <CardTitle>🧠 Rebuild Embeddings</CardTitle>
                <CardDescription>
                  Use this after starting Chroma to index all existing notes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={reindexNotes}>
                  <Button type="submit" variant="outline">
                    Reindex notes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <CardHeader>
              <CardTitle>All notes</CardTitle>
              <CardDescription>
                {notes.length === 0
                  ? "No notes yet."
                  : `You have ${notes.length} note${
                      notes.length === 1 ? "" : "s"
                    }.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notes.length === 0 ? (
                <div className="rounded-xl border border-white/30 bg-white/70 p-6 text-sm text-slate-600 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Start by adding your first note.
                </div>
              ) : (
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="group relative flex h-48 flex-col rounded-xl border border-white/30 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex flex-1 flex-col gap-2 overflow-hidden">
                        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
                          {note.title}
                        </h3>
                        {note.content && (
                          <p className="line-clamp-4 flex-1 text-sm text-slate-600 dark:text-slate-300">
                            {note.content}
                          </p>
                        )}
                      </div>
                      <form
                        action={deleteNote}
                        className="mt-3 flex justify-end opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <input type="hidden" name="id" value={note.id} />
                        <Button type="submit" size="sm" variant="destructive">
                          Delete
                        </Button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
