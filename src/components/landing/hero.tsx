import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl">
          Your second brain,
          <br />
          <span className="bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent dark:from-slate-300 dark:to-slate-500">
            powered by AI
          </span>
        </h1>
        <p className="mb-10 text-xl text-slate-600 dark:text-slate-300 sm:text-2xl">
          Capture ideas, search by meaning, and chat with your notes using
          intelligent RAG technology.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/signup">Start for free</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
