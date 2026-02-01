"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push("/signin?created=1");
      return;
    }

    if (response.status === 409) {
      router.push("/signin?error=exists");
      return;
    }

    const data = await response.json().catch(() => null);
    setError(data?.message ?? "Sign up failed. Please try again.");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-foreground dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 py-12">
        <Card className="w-full border-white/20 bg-white/60 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>
              Enter your details to start taking notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50/80 p-3 text-sm text-red-800 backdrop-blur-sm dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Must be at least 6 characters
                </p>
              </div>
              <Button type="submit" className="w-full">
                Create account
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
              Have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700 dark:text-white dark:hover:text-slate-200"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
