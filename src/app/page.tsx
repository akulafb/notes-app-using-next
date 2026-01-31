import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-foreground dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex w-fit rounded-full border border-white/40 bg-white/40 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              Glassmorphism UI
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Capture ideas, keep every note organized.
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              A clean, fast notes app with secure accounts and beautiful
              glassmorphism styling.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/signup">Create account</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/notes">Open notes</Link>
              </Button>
            </div>
            <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <div className="rounded-xl border border-white/40 bg-white/40 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                Sync notes with Prisma + SQLite
              </div>
              <div className="rounded-xl border border-white/40 bg-white/40 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                Built-in authentication
              </div>
            </div>
          </div>

          <Card className="border-white/20 bg-white/60 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Your notes are always ready when inspiration hits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-white/30 bg-white/70 p-4 text-sm text-slate-700 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                “Draft product ideas, meeting notes, or quick to-dos in one
                place.”
              </div>
              <Separator className="bg-white/40 dark:bg-white/10" />
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Secure access</span>
                  <span className="font-medium">Auth.js</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Storage</span>
                  <span className="font-medium">Prisma + SQLite</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button asChild variant="ghost">
                <Link href="/signin">Continue</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/notes">View notes</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
