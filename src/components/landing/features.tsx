"use client";

import { motion } from "motion/react";
import { Search, MessageSquare, Shield, Sparkles } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Semantic Search",
      description:
        "Find notes by meaning, not just keywords. Powered by vector embeddings.",
      icon: Search,
    },
    {
      title: "AI Chat",
      description:
        "Ask questions and get answers based on your notes using RAG technology.",
      icon: MessageSquare,
    },
    {
      title: "Secure & Private",
      description:
        "Your data stays local. Built with Next.js, Prisma, and ChromaDB.",
      icon: Shield,
    },
    {
      title: "Beautiful UI",
      description:
        "Clean design that adapts to your system theme preferences.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const }}
        >
          <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Everything you need
          </h2>
          <p className="text-muted-foreground">
            Powerful features to help you capture and retrieve knowledge
          </p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/50 hover:bg-accent/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.25, 0.4, 0.25, 1] as const,
              }}
            >
              <feature.icon className="mb-3 h-5 w-5 text-accent" />
              <h3 className="mb-1.5 text-sm font-medium">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
