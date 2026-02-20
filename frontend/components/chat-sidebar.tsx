'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { FileText, MessageSquare, Plus, Trash2, Loader2 } from 'lucide-react'

export interface ChatSession {
  id: string
  name: string
  fileName: string
  createdAt: Date
}

interface ChatSidebarProps {
  sessions: ChatSession[]
  activeSessionId: string | null
  onSessionSelect: (sessionId: string) => void
  onNewSession: () => void
  onDeleteSession: (sessionId: string) => void
  isLoading?: boolean
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  isLoading = false,
}: ChatSidebarProps) {
  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Sessions</h2>
        <Button
          size="sm"
          onClick={onNewSession}
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
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
                  'group relative flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50',
                  activeSessionId === session.id && 'bg-primary/10 border border-primary/20'
                )}
              >
                <button
                  onClick={() => onSessionSelect(session.id)}
                  className="flex flex-1 items-start gap-3 text-left"
                >
                  <MessageSquare className={cn(
                    "h-4 w-4 mt-0.5 flex-shrink-0 transition-colors",
                    activeSessionId === session.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate transition-colors",
                      activeSessionId === session.id ? "text-primary" : "text-foreground"
                    )}>
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
                    e.stopPropagation()
                    onDeleteSession(session.id)
                  }}
                  className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
