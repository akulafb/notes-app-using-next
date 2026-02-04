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
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Semantic Search</CardTitle>
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
            {loading ? "..." : "Search"}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
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
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-muted-foreground">
              Found {results.length} result{results.length === 1 ? "" : "s"}:
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, i) => (
                <motion.div
                  key={result.noteId}
                  className="rounded-lg border border-border bg-card p-3 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: i * 0.03,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {result.metadata.title && (
                        <p className="font-medium text-card-foreground mb-1">
                          {result.metadata.title}
                        </p>
                      )}
                      <p className="text-muted-foreground line-clamp-3">
                        {result.text}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {(result.similarity * 100).toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {results.length === 0 && !loading && !error && query && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No results found. Try a different query.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
