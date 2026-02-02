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
import { AnimatedCard } from "./components/animated-card";
import { EmptyState } from "./components/empty-state";
import { NotesGrid } from "./components/notes-grid";
import { PageHeader } from "./components/page-header";
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
        <PageHeader email={email} />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.9fr]">
          <div className="space-y-6">
            <AnimatedCard delay={0.1}>
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
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <RAGSearch />
            </AnimatedCard>
            <AnimatedCard delay={0.3}>
              <RAGChat />
            </AnimatedCard>
            <AnimatedCard delay={0.4}>
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
            </AnimatedCard>
          </div>

          <AnimatedCard delay={0.15}>
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
                  <EmptyState />
                ) : (
                  <NotesGrid notes={notes} deleteNote={deleteNote} />
                )}
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      </div>
    </main>
  );
}
