"use client";

import { motion } from "motion/react";

export function Features() {
  const features = [
    {
      title: "Semantic Search",
      description:
        "Find notes by meaning, not just keywords. Powered by vector embeddings.",
      icon: "🔍",
    },
    {
      title: "AI Chat",
      description:
        "Ask questions and get answers based on your notes using RAG technology.",
      icon: "💬",
    },
    {
      title: "Secure & Private",
      description:
        "Your data stays local. Built with Next.js, Prisma, and ChromaDB.",
      icon: "🔒",
    },
    {
      title: "Beautiful UI",
      description:
        "Glassmorphism design that adapts to your system theme preferences.",
      icon: "✨",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Everything you need
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Powerful features to help you capture and retrieve knowledge
          </p>
        </motion.div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl dark:border-white/10 dark:bg-white/10"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              <motion.div
                className="mb-4 text-4xl"
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
