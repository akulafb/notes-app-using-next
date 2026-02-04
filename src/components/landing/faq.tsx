"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    question: "How does semantic search work?",
    answer:
      "Semantic search uses AI embeddings to understand the meaning of your notes. Instead of matching keywords, it finds notes that are conceptually similar to your query.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes! Everything runs locally on your machine. Your notes are stored in SQLite, embeddings in ChromaDB, and AI processing uses local Ollama. Nothing leaves your computer.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "You'll need Ollama installed locally for the AI chat feature. ChromaDB starts automatically with the app. Everything else is included.",
  },
  {
    question: "Can I use this offline?",
    answer:
      "Absolutely! Since everything runs locally, you can use all features without an internet connection.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-2xl">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const }}
        >
          <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about Notes
          </p>
        </motion.div>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="rounded-lg border border-border bg-card p-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: [0.25, 0.4, 0.25, 1] as const,
              }}
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between text-left"
              >
                <h3 className="text-sm font-medium">
                  {faq.question}
                </h3>
                <span
                  className={`ml-4 text-muted-foreground transition-transform duration-200 ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] as const }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
