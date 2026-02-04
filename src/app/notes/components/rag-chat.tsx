"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Message {
  role: "user" | "assistant";
  content: string;
  retrievedNotes?: string[];
}

export function RAGChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, numNotes: 3 }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 503) {
          throw new Error(
            errorData.details ||
              "Ollama is not running. Please start Ollama locally."
          );
        }
        throw new Error(errorData.error || "Failed to get answer");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
        retrievedNotes: data.retrievedNotes || [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get answer from AI"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Chat with Your Notes</CardTitle>
        <CardDescription>
          Ask questions and get answers based on your notes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat messages */}
        <div className="space-y-3 max-h-96 overflow-y-auto min-h-[200px]">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Start a conversation! Ask questions about your notes.
            </p>
          )}
          <AnimatePresence>
            {messages.map((message, i) => (
              <motion.div
                key={i}
                className={`flex flex-col gap-2 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-card-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                {message.role === "assistant" &&
                  message.retrievedNotes &&
                  message.retrievedNotes.length > 0 && (
                    <details className="text-xs text-muted-foreground max-w-[80%]">
                      <summary className="cursor-pointer transition-colors hover:text-foreground">
                        Notes used ({message.retrievedNotes.length})
                      </summary>
                      <ul className="mt-2 space-y-1 pl-4">
                        {message.retrievedNotes.map((note, j) => (
                          <li key={j} className="line-clamp-2">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex items-start gap-2">
              <div className="bg-card border border-border rounded-lg p-3 animate-pulse">
                <p className="text-sm text-muted-foreground">
                  Thinking...
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <AnimatePresence>
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

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about your notes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            Send
          </Button>
        </div>

        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
            className="w-full"
          >
            Clear Chat
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
