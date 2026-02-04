"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center px-6 py-16">
      <motion.div
        className="mx-auto max-w-4xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mb-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          variants={itemVariants}
        >
          Your second brain,
          <br />
          <span className="text-accent">powered by AI</span>
        </motion.h1>
        <motion.p
          className="mx-auto mb-10 max-w-xl text-base text-muted-foreground sm:text-lg"
          variants={itemVariants}
        >
          Capture ideas, search by meaning, and chat with your notes using
          intelligent RAG technology.
        </motion.p>
        <motion.div
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
          variants={itemVariants}
        >
          <Button asChild size="lg" className="h-11 w-full px-6 sm:w-auto">
            <Link href="/signup">Start for free</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 w-full px-6 sm:w-auto">
            <Link href="/signin">Sign in</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
