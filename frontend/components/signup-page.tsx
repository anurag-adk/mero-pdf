"use client";

import React from "react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/brand-logo";
import { ArrowRight, Loader2, FileText, Zap, Brain } from "lucide-react";

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const { signup } = useAuth();
  const { resolvedTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const invertedButtonStyle =
    resolvedTheme === "dark"
      ? { backgroundColor: "#ffffff", color: "#000000" }
      : { backgroundColor: "#000000", color: "#ffffff" };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signup(name, email, password);
    } catch (err) {
      setError("Failed to create account. Email may already be in use.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[55%_45%]">
      {/* ── Left: Logo & Brand ── */}
      <div className="hidden lg:flex flex-col items-center justify-center px-16 py-16 bg-linear-to-br from-secondary/40 to-secondary/10 border-r border-border">
        {/* Logo with wipe animation - Bigger */}
        <div className="auth-wipe-reveal mb-12">
          <BrandLogo
            variant="vertical"
            priority
            className="max-w-4xl 2xl:max-w-6xl"
            isLink={true}
          />
        </div>

        {/* Tagline with fade-in */}
        <div className="text-center space-y-6 auth-fade-in animation-delay-300 mt-2">
          <div>
            <h2 className="text-xl font-light text-foreground mb-1">
              Unlock your documents
            </h2>
            <p className="text-xs text-muted-foreground">
              Ask questions. Get answers. Instantly.
            </p>
          </div>

          {/* Feature cards */}
          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">
                  Any Document
                </p>
                <p className="text-xs text-muted-foreground">
                  PDFs, reports, contracts
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">
                  Instant Answers
                </p>
                <p className="text-xs text-muted-foreground">
                  No waiting, no skimming
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">
                  AI Powered
                </p>
                <p className="text-xs text-muted-foreground">
                  Smart understanding
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="flex flex-col justify-between px-6 py-10 sm:px-10 lg:px-12">
        <div className="lg:hidden mb-6">
          <BrandLogo
            variant="horizontal"
            priority
            className="max-w-30"
            isLink={true}
          />
        </div>

        <div className="mx-auto w-full max-w-sm space-y-8 py-10">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Start chatting with your documents in seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Full name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10 rounded-lg border-border bg-muted/50 text-sm focus:bg-background"
              />
            </div>

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
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                className="h-10 rounded-lg border-border bg-muted/50 text-sm focus:bg-background"
              />
            </div>

            {error && (
              <div
                className="rounded-lg border px-3.5 py-2.5 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1"
                style={{
                  backgroundColor: "#fff1f2",
                  borderColor: "#fda4af",
                  color: "#be123c",
                }}
              >
                <span style={{ color: "#e11d48" }}>⚠</span>
                {error}
              </div>
            )}

            <Button
              type="submit"
              style={invertedButtonStyle}
              className="h-10 w-full rounded-lg text-sm font-semibold shadow-none hover:opacity-90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground/60">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

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
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-foreground hover:underline underline-offset-4 cursor-pointer transition-colors hover:text-primary"
            >
              Sign in
            </button>
          </p>
        </div>

        <p className="text-xs text-muted-foreground/50 text-center">
          © 2026 MeroPDF
        </p>
      </div>
    </div>
  );
}
