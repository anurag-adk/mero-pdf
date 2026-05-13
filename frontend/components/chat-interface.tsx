"use client";

import React from "react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUp, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  fileName: string;
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

export function ChatInterface({
  messages,
  fileName,
  onSendMessage,
  isLoading = false,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = container;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const message = input.trim();
    setInput("");
    setIsSending(true);

    try {
      await onSendMessage(message);
    } catch (error) {
      console.error("[v0] Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted">
          <FileText className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground leading-tight">
            {fileName}
          </p>
          <p className="text-xs text-muted-foreground">
            Ask anything about this document
          </p>
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-5 py-6 space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
                <BrandLogo variant="mark" className="h-8 w-8" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                Ready to help
              </h3>
              <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                Ask me anything about{" "}
                <span className="font-medium text-foreground">{fileName}</span>{" "}
                and I'll find the answer.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted mt-0.5">
                  <BrandLogo variant="mark" className="h-4 w-4" />
                </div>
              )}

              <div className="flex max-w-[80%] flex-col gap-1">
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-foreground text-background rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm border border-border/60",
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <span
                  className={cn(
                    "text-[10px] text-muted-foreground/60 px-1",
                    message.role === "user" ? "text-right" : "text-left",
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {message.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-foreground mt-0.5">
                  <span className="text-[10px] font-semibold text-background">
                    You
                  </span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted mt-0.5">
                <BrandLogo variant="mark" className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-bl-sm border border-border/60 bg-muted px-4 py-3">
                <div className="flex items-end gap-1.5 h-4">
                  <span className="dot-1 inline-block h-2 w-2 rounded-full bg-muted-foreground/60" />
                  <span className="dot-2 inline-block h-2 w-2 rounded-full bg-muted-foreground/60" />
                  <span className="dot-3 inline-block h-2 w-2 rounded-full bg-muted-foreground/60" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-28 right-8 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background shadow-md transition-all hover:shadow-lg animate-fade-in"
            aria-label="Scroll to bottom"
          >
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        )}
      </div>

      {/* ── Input ── */}
      <div className="border-t border-border bg-background p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
          <div className="relative flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-3 focus-within:border-foreground/30 focus-within:bg-background transition-colors">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your document..."
              className="min-h-10 max-h-32 flex-1 resize-none border-0 bg-transparent p-0 text-sm leading-6 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
              disabled={isSending}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isSending}
              className="h-8 w-8 shrink-0 rounded-xl bg-foreground text-background hover:bg-foreground/85 disabled:opacity-30"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground/40">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
}
