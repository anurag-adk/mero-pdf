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
    <div className="grid min-h-screen lg:grid-cols-[55%_45%]">
      {/* ── Left: Logo & Brand ── */}
      <div className="hidden lg:flex flex-col items-center justify-center px-16 py-16 bg-linear-to-br from-secondary/40 to-secondary/10 border-r border-border">
        {/* Logo with wipe animation */}
        <div className="auth-wipe-reveal mb-16">
          <BrandLogo
            variant="vertical"
            priority
            className="max-w-60"
            isLink={true}
          />
        </div>

        {/* Tagline with fade-in */}
        <div className="text-center space-y-3 auth-fade-in animation-delay-300">
          <h2 className="text-2xl font-semibold text-foreground">
            Chat with your PDFs
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Upload documents and get instant answers powered by AI
          </p>
        </div>
      </div>

      {/* ── Right: Form ── */}
      <div className="flex flex-col justify-between px-6 py-10 sm:px-10 lg:px-12">
        <div className="lg:hidden mb-6">
          <BrandLogo variant="horizontal" priority className="max-w-30" />
        </div>

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
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive font-medium flex items-center gap-2">
                <span>⚠</span>
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
    </div>
  );
}
