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
    <section className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Everything you need to know about Notes
          </p>
        </motion.div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="rounded-xl border border-white/20 bg-white/60 p-6 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
              }}
            >
              <motion.button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between text-left"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {faq.question}
                </h3>
                <motion.span
                  className="text-2xl text-slate-600 dark:text-slate-300"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  +
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    className="mt-4 text-slate-600 dark:text-slate-300"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
