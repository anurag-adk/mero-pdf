"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";
import {
  FileText,
  MessageSquare,
  Plus,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
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
    return (
      <div className="flex h-full w-16 flex-col bg-sidebar">
        {/* Logo mark */}
        <div className="flex h-13 items-center justify-center border-b border-border">
          <BrandLogo variant="mark" className="h-6 w-6" />
        </div>

        {/* Expand toggle */}
        <div className="flex items-center justify-center py-2 border-b border-border">
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* New session */}
        <div className="flex items-center justify-center py-2.5 border-b border-border">
          <Button
            size="icon"
            variant="ghost"
            onClick={onNewSession}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="New session"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="flex flex-col items-center gap-1 p-2">
            {isLoading ? (
              <Loader2 className="mt-6 h-5 w-5 animate-spin text-muted-foreground" />
            ) : sessions.length === 0 ? (
              <FileText className="mt-6 h-5 w-5 text-muted-foreground/40" />
            ) : (
              sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSessionSelect(session.id)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    activeSessionId === session.id
                      ? "bg-foreground/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  title={session.name}
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Full sidebar
  return (
    <div className="flex h-full w-65 flex-col bg-sidebar">
      {/* Header */}
      <div className="flex h-13 items-center justify-between border-b border-border px-4">
        <BrandLogo variant="horizontal" className="max-w-30" />
        <div className="flex items-center gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            onClick={onNewSession}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title="New session"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          {onToggleCollapse && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onToggleCollapse}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Collapse sidebar"
            >
              <PanelLeft className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Label */}
      <div className="px-4 py-3">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">
          All sessions
        </p>
      </div>

      {/* Session list */}
      <ScrollArea className="flex-1">
        <div className="px-2 pb-3">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Loading...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <FileText className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">No sessions yet</p>
              <p className="text-xs text-muted-foreground/60">
                Upload a PDF to start
              </p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group relative flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors cursor-pointer",
                  activeSessionId === session.id
                    ? "bg-foreground/8 text-foreground"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
                onClick={() => onSessionSelect(session.id)}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                <div className="flex-1 min-w-0 flex-col flex">
                  <p
                    className="text-xs font-medium leading-tight"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {session.fileName}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {session.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="group/delete h-6 w-6 shrink-0 p-0 text-foreground/80 transition-colors hover:!text-red-600 hover:!bg-red-50 dark:text-foreground/80 dark:hover:!text-red-400 dark:hover:!bg-red-950/20"
                >
                  <Trash2 className="h-3 w-3 transition-colors group-hover/delete:text-red-600 dark:group-hover/delete:text-red-400" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
