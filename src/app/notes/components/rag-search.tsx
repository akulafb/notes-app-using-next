"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchResult {
  noteId: string;
  text: string;
  similarity: number;
  metadata: {
    title?: string;
  };
}

export function RAGSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch() {
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/rag/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, limit: 10 }),
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data.notes || []);
    } catch (err) {
      setError("Failed to search notes. Make sure embeddings are set up.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
      <CardHeader>
        <CardTitle>🔍 Semantic Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search by meaning, not keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              className="rounded-lg border border-red-200 bg-red-50/80 p-3 text-sm text-red-800 backdrop-blur-sm dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {results.length > 0 && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Found {results.length} result{results.length === 1 ? "" : "s"}:
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, i) => (
                <motion.div
                  key={result.noteId}
                  className="rounded-lg border border-white/30 bg-white/70 p-3 text-sm shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    x: 4,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {result.metadata.title && (
                        <p className="font-semibold text-slate-900 dark:text-white mb-1">
                          {result.metadata.title}
                        </p>
                      )}
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-3">
                        {result.text}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {(result.similarity * 100).toFixed(0)}% match
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {results.length === 0 && !loading && !error && query && (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
            No results found. Try a different query.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
