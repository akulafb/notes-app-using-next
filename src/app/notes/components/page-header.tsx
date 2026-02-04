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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Your notes
        </h1>
        <p className="text-sm text-muted-foreground">
          Signed in as {email}.
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/api/auth/signout">Sign out</Link>
      </Button>
    </motion.div>
  );
}
