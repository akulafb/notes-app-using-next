"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function Footer() {
  return (
    <motion.footer
      className="border-t border-white/10 bg-white/60 py-12 backdrop-blur-xl dark:bg-white/5"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Notes
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Your intelligent note-taking companion powered by AI.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/signup" className="hover:text-slate-900 dark:hover:text-white">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-slate-900 dark:hover:text-white">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Technology
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Next.js</li>
              <li>ChromaDB</li>
              <li>Ollama</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Privacy
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              All data stays local. No cloud, no tracking, no sharing.
            </p>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-slate-600 dark:text-slate-300">
          <p>© {new Date().getFullYear()} Notes. Built with privacy in mind.</p>
        </div>
      </div>
    </motion.footer>
  );
}
