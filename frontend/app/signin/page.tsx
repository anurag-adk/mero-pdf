"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginPage } from "@/components/login-page";
import { useAuth } from "@/contexts/auth-context";

export default function SignInPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <LoginPage onSwitchToSignup={() => router.push("/signup")} />;
}
