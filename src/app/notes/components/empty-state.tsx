"use client";

import { motion } from "motion/react";

export function EmptyState() {
  return (
    <motion.div
      className="rounded-xl border border-white/30 bg-white/70 p-6 text-sm text-slate-600 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Start by adding your first note.
    </motion.div>
  );
}
