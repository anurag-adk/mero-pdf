"use client";

import React from "react";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/brand-logo";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  ShieldCheck,
  FileText,
  Search,
} from "lucide-react";

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signup(email, password, name);
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col justify-between border-b border-border/70 bg-background px-5 py-6 sm:px-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-8">
        <div className="mx-auto flex w-full max-w-md items-center justify-between">
          <BrandLogo variant="horizontal" priority className="shrink-0" />
          <div className="rounded-full border border-border bg-card px-3 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
            Join MeroPDF
          </div>
        </div>

        <div className="mx-auto w-full max-w-md py-12 lg:py-0">
          <div className="mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground surface-glow">
              <Sparkles className="h-3.5 w-3.5" />
              Start with a clean workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Create your account.
            </h1>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
              Make a home for your PDFs, chats, and search history.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-[1.5rem] border border-border bg-card p-5 shadow-sm surface-glow sm:p-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-11"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="h-11 w-full text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy
            </p>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-col lg:justify-between lg:bg-gradient-to-br lg:from-background lg:via-card lg:to-muted/40 lg:px-10 lg:py-8">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
          <div className="flex justify-center">
            <BrandLogo
              variant="vertical"
              priority
              className="w-full max-w-[280px]"
            />
          </div>

          <div className="grid gap-4 rounded-[1.5rem] border border-border bg-card/85 p-5 shadow-sm surface-glow">
            {[
              {
                icon: FileText,
                title: "Keep it simple",
                body: "Upload, chat, and find answers without clutter.",
              },
              {
                icon: Search,
                title: "Search smart",
                body: "Use natural language against your document stack.",
              },
              {
                icon: ShieldCheck,
                title: "Stay protected",
                body: "Accounts, sessions, and access stay in control.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/60 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
                  <item.icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
