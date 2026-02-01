import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-slate-900 dark:text-white">
          Notes
        </Link>
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/signin">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
