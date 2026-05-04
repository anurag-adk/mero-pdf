"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  FileText,
  MessageSquare,
  Plus,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface ChatSession {
  id: string;
  name: string;
  fileName: string;
  createdAt: Date;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  isLoading?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  isLoading = false,
  isCollapsed = false,
  onToggleCollapse,
}: ChatSidebarProps) {
  if (isCollapsed) {
    // Icon-only mode
    return (
      <div className="flex h-full w-20 flex-col border-r border-border bg-card">
        <div className="flex items-center justify-center border-b border-border p-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggleCollapse}
            className="h-8 w-8 transition-smooth"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-2 p-2">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex justify-center py-8">
                <FileText className="h-6 w-6 text-muted-foreground opacity-50" />
              </div>
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSessionSelect(session.id)}
                  className={cn(
                    "w-full rounded-lg p-2 transition-smooth flex items-center justify-center hover:bg-muted/50",
                    activeSessionId === session.id && "bg-primary/15 border border-primary/30"
                  )}
                  title={session.name}
                >
                  <MessageSquare
                    className={cn(
                      "h-5 w-5",
                      activeSessionId === session.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border p-2">
          <Button
            size="icon"
            onClick={onNewSession}
            className="h-8 w-8 transition-smooth mx-auto block"
            title="New session"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Full sidebar mode
  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4 gap-2">
        <h2 className="text-lg font-semibold text-foreground">Sessions</h2>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={onNewSession}
            className="h-8 w-8 p-0 transition-smooth"
            title="New session"
          >
            <Plus className="h-4 w-4" />
          </Button>
          {onToggleCollapse && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0 transition-smooth"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-3">
          {isLoading ? (
            <div className="px-3 py-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Loading sessions...
              </p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
              <p className="mt-2 text-sm text-muted-foreground">
                No sessions yet
              </p>
              <p className="text-xs text-muted-foreground">
                Upload a PDF to start
              </p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group relative flex items-start gap-3 rounded-xl px-4 py-3 transition-smooth shadow-sm border border-transparent hover:border-primary/20",
                  activeSessionId === session.id
                    ? "bg-gradient-to-r from-primary/15 to-accent/10 border-primary/30 shadow-md"
                    : "hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5"
                )}
              >
                <button
                  onClick={() => onSessionSelect(session.id)}
                  className="flex flex-1 items-start gap-3 text-left"
                >
                  <MessageSquare
                    className={cn(
                      "h-4 w-4 mt-0.5 flex-shrink-0 transition-colors",
                      activeSessionId === session.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate transition-colors",
                        activeSessionId === session.id
                          ? "text-primary font-semibold"
                          : "text-foreground"
                      )}
                    >
                      {session.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.fileName}
                    </p>
                  </div>
                </button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
