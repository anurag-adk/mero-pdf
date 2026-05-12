"use client";

import React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/brand-logo";
import { ArrowRight, Loader2 } from "lucide-react";

interface LoginPageProps {
  onSwitchToSignup: () => void;
}

export function LoginPage({ onSwitchToSignup }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ── Left: form ── */}
      <div className="flex flex-col justify-between px-6 py-10 sm:px-10 lg:px-16">
        <BrandLogo variant="horizontal" priority className="max-w-30" />

        <div className="mx-auto w-full max-w-sm space-y-8 py-10">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue to your documents.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 rounded-lg border-border bg-muted/50 text-sm focus:bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 rounded-lg border-border bg-muted/50 text-sm focus:bg-background"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/8 px-3.5 py-2.5 text-xs text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="h-10 w-full rounded-lg bg-foreground text-sm font-medium text-background hover:bg-foreground/85"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="font-medium text-foreground hover:underline underline-offset-4"
            >
              Create one free
            </button>
          </p>
        </div>

        <p className="text-xs text-muted-foreground/50 text-center">
          © 2026 MeroPDF
        </p>
      </div>

      {/* ── Right: brand panel ── */}
      <div className="hidden flex-col justify-between border-l border-border bg-muted/30 px-16 py-16 lg:flex">
        <div />
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
            Upload, ask,
            <br />
            <span className="font-light italic text-muted-foreground">
              get answers.
            </span>
          </h2>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            Your PDFs become searchable with AI. Every question answered with
            context. Every session saved.
          </p>
        </div>
        <div className="space-y-3">
          {[
            "RAG-powered semantic search",
            "Instant answers from your docs",
            "Session history preserved",
          ].map((feat) => (
            <div
              key={feat}
              className="flex items-center gap-2.5 text-sm text-muted-foreground"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" />
              {feat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
