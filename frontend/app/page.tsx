"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  FileText,
  Layers3,
  LockKeyhole,
  Search,
  Upload,
  Zap,
} from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";

const features = [
  {
    icon: Search,
    title: "Smart search",
    body: "RAG powered retrieval finds exact context in your PDFs.",
  },
  {
    icon: Upload,
    title: "Quick upload",
    body: "Drop files and start chatting instantly.",
  },
  {
    icon: LockKeyhole,
    title: "Secure",
    body: "Token auth and session-based privacy.",
  },
  {
    icon: Layers3,
    title: "Scalable stack",
    body: "Qdrant, MongoDB, and Azure backend.",
  },
];

const steps = [
  { num: "1", title: "Upload PDF", body: "Bring your document in." },
  { num: "2", title: "Ask", body: "Type your question naturally." },
  { num: "3", title: "Get answer", body: "System retrieves context." },
  { num: "4", title: "History saved", body: "All chats stay with session." },
];

const pricing = [
  {
    name: "Starter",
    price: "Free",
    points: ["1 user", "Basic uploads", "Chat history"],
    featured: false,
  },
  {
    name: "Pro",
    price: "Soon",
    points: ["More uploads", "Faster retrieval", "Better tools"],
    featured: true,
  },
  {
    name: "Team",
    price: "Custom",
    points: ["Multi-user", "Shared docs", "Priority support"],
    featured: false,
  },
];

const stats = [
  { value: "RAG", label: "Fast search" },
  { value: "Azure", label: "Storage" },
  { value: "Qdrant", label: "Database" },
  { value: "Auto-saved", label: "Sessions" },
];

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [isLoading, router, user]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      {/* ── Nav ── */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <header className="flex items-center justify-between py-5">
          <BrandLogo variant="horizontal" priority className="max-w-32" />

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground lg:flex">
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              How It Works
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-foreground"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              className="rounded-full bg-foreground px-5 text-sm text-background hover:bg-foreground/85"
            >
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-foreground px-5 text-sm text-background hover:bg-foreground/85"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </header>
      </div>

      {/* ── Hero ── */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section className="flex flex-col items-center gap-12 py-8 text-center sm:py-12 lg:py-16">
          {/* Badge */}
          <div className="hero-fade-1 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            AI-Powered PDF Intelligence
          </div>

          {/* Headline */}
          <div className="hero-fade-2 space-y-4 max-w-3xl">
            <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Chat with your
              <span className="block font-light italic text-muted-foreground">
                documents.
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Upload your document, Ask questions, Get instant reliable answers.
              No setup. No complexity. Pure simplicity.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="hero-fade-3 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-foreground px-8 text-background hover:bg-foreground/85"
            >
              <Link href="/signup">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 border-border hover:bg-muted"
            >
              <a href="#how">Watch demo</a>
            </Button>
          </div>

          {/* Stats row */}
          <div className="hero-fade-4 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-border bg-card px-4 py-5 text-center transition-colors hover:bg-muted/60"
              >
                <p className="text-base font-semibold text-foreground">
                  {item.value}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Features ── */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section id="features" className="space-y-12 py-20 sm:py-28">
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Core Features
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for simplicity
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => (
              <Card
                key={item.title}
                className="rounded-xl border-border bg-card p-6 transition-all duration-300 hover:bg-muted/50 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
                  <item.icon className="h-4 w-4 text-foreground" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {item.body}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* ── How It Works ── */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section id="how" className="space-y-12 py-20 sm:py-28">
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Process
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How it works
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:bg-muted/30 cursor-pointer"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-sm font-semibold text-foreground">
                  {step.num}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Pricing ── */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <section id="pricing" className="space-y-12 py-20 sm:py-28">
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Pricing
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple pricing
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {pricing.map((tier) => (
              <Card
                key={tier.name}
                className={`rounded-xl border p-6 transition-colors ${
                  tier.featured
                    ? "border-foreground/20 bg-foreground text-background"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm font-semibold ${tier.featured ? "text-background" : "text-foreground"}`}
                  >
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <span className="rounded-full border border-background/20 bg-background/10 px-3 py-1 text-xs text-background/80">
                      Popular
                    </span>
                  )}
                </div>
                <p
                  className={`mt-4 text-3xl font-semibold ${tier.featured ? "text-background" : "text-foreground"}`}
                >
                  {tier.price}
                </p>
                <div className="mt-6 space-y-3">
                  {tier.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-center gap-3 text-sm"
                    >
                      <Check
                        className={`h-4 w-4 shrink-0 ${tier.featured ? "text-background/70" : "text-foreground"}`}
                      />
                      <span
                        className={
                          tier.featured
                            ? "text-background/80"
                            : "text-muted-foreground"
                        }
                      >
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  asChild
                  className={`mt-8 w-full rounded-lg text-sm ${
                    tier.featured
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-foreground text-background hover:bg-foreground/85"
                  }`}
                >
                  <Link href={tier.featured ? "/signup" : "#"}>
                    {tier.featured ? "Get started" : "Learn more"}
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-20 border-t border-border bg-secondary/30">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 py-12 sm:py-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div>
              <BrandLogo
                variant="horizontal"
                className="max-w-27 mb-4"
                isLink={false}
              />
              <p className="text-sm text-muted-foreground">
                Chat with your PDFs. Zero complexity.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="/signin"
                    className="hover:text-foreground transition-colors"
                  >
                    Sign in
                  </a>
                </li>
                <li>
                  <a
                    href="/signup"
                    className="hover:text-foreground transition-colors"
                  >
                    Get Started
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2024 MeroPDF. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
