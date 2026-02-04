import { FAQ } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Subtle dot pattern background */}
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern" />
      {/* Subtle radial gradient using accent color */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(173_80%_40%/0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(173_80%_40%/0.12),transparent)]" />
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      <Footer />
    </main>
  );
}
