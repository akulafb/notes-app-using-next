import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 font-semibold tracking-tight">
              Notes
            </h3>
            <p className="text-sm text-muted-foreground">
              Your intelligent note-taking companion powered by AI.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-medium">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/signup" className="transition-colors hover:text-foreground">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/signin" className="transition-colors hover:text-foreground">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-medium">
              Technology
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Next.js</li>
              <li>ChromaDB</li>
              <li>Ollama</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-medium">
              Privacy
            </h4>
            <p className="text-sm text-muted-foreground">
              All data stays local. No cloud, no tracking, no sharing.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Notes. Built with privacy in mind.</p>
        </div>
      </div>
    </footer>
  );
}
