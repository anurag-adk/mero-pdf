"use client";

import React from "react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, Send } from "lucide-react";
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll to show/hide button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = container;
      // Show button if scrolled up more than 100px from bottom
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
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-4 sm:px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
          <BrandLogo variant="mark" className="h-7 w-7" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{fileName}</h2>
          <p className="text-xs text-muted-foreground">
            Ask anything about this document
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 relative"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Ready to chat!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground text-pretty">
                  Ask me anything about the document and I'll help you find
                  answers.
                </p>
              </div>
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background flex-shrink-0">
                  <BrandLogo variant="mark" className="h-5 w-5" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <div
                  className={cn(
                    "max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[80%] rounded-xl px-4 py-3 shadow-sm transition-smooth",
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-none"
                      : "bg-gradient-to-br from-card to-muted text-foreground rounded-bl-none border border-border/50 shadow-sm",
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground px-2">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {message.role === "user" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background flex-shrink-0">
                  <span className="text-xs font-semibold text-foreground">
                    You
                  </span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background flex-shrink-0">
                <BrandLogo variant="mark" className="h-5 w-5" />
              </div>
              <div className="rounded-lg bg-muted px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-32 right-8 lg:right-10 z-10 rounded-full bg-primary text-primary-foreground p-3 shadow-lg transition-smooth hover:shadow-xl hover:scale-110 animate-fade-in"
            aria-label="Scroll to bottom"
          >
            <svg
              className="h-5 w-5"
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

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your document..."
              className="min-h-[60px] resize-none"
              disabled={isSending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isSending}
              className="h-[60px] w-[60px] flex-shrink-0"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
