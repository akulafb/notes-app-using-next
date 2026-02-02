"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center px-6 py-24">
      <motion.div
        className="mx-auto max-w-4xl text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl md:text-7xl"
          variants={itemVariants}
        >
          Your second brain,
          <br />
          <span className="bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent dark:from-slate-300 dark:to-slate-500">
            powered by AI
          </span>
        </motion.h1>
        <motion.p
          className="mb-10 text-xl text-slate-600 dark:text-slate-300 sm:text-2xl"
          variants={itemVariants}
        >
          Capture ideas, search by meaning, and chat with your notes using
          intelligent RAG technology.
        </motion.p>
        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          variants={itemVariants}
        >
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/signup">Start for free</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/signin">Sign in</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
