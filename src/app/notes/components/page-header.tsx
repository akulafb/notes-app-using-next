"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  email: string;
}

export function PageHeader({ email }: PageHeaderProps) {
  return (
    <motion.div
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
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
    </motion.div>
  );
}
