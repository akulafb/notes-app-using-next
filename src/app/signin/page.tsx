"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const created = searchParams.get("created");
  const exists = searchParams.get("error") === "exists";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/notes");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-foreground dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 py-12">
        <Card className="w-full border-white/20 bg-white/60 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {created && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50/80 p-3 text-sm text-green-800 backdrop-blur-sm dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                Account created. Please sign in.
              </div>
            )}
            {exists && (
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50/80 p-3 text-sm text-blue-800 backdrop-blur-sm dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                Email already exists. Please sign in.
              </div>
            )}
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
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
              New here?{" "}
              <Link
                href="/signup"
                className="font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700 dark:text-white dark:hover:text-slate-200"
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
