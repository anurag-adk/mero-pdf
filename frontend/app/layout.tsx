import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MeroPDF",
    template: "%s | MeroPDF",
  },
  description:
    "MeroPDF is an intelligent document query system for natural language PDF search and chat.",
  icons: {
    icon: [
      { url: "/Logo/Brandmark-Light.png", media: "(prefers-color-scheme: light)" },
      { url: "/Logo/Brandmark-Dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [
      { url: "/Logo/Brandmark-Light.png", media: "(prefers-color-scheme: light)" },
      { url: "/Logo/Brandmark-Dark.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
