"use client";

import { ChatInterface, type Message } from "@/components/chat-interface";
import { ChatSidebar, type ChatSession } from "@/components/chat-sidebar";
import { PdfUpload } from "@/components/pdf-upload";
import { UserProfile } from "@/components/user-profile";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Menu, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isUploadingPDF, setIsUploadingPDF] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/signin");
    }
  }, [isLoading, user, router]);

  // Restore sidebar collapse state from localStorage
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsedState !== null) {
      setIsSidebarCollapsed(JSON.parse(savedCollapsedState));
    }
  }, []);

  // Save sidebar collapse state to localStorage
  useEffect(() => {
    localStorage.setItem(
      "sidebarCollapsed",
      JSON.stringify(isSidebarCollapsed),
    );
  }, [isSidebarCollapsed]);

  // Restore messages from localStorage on mount (for local cache)
  useEffect(() => {
    const savedMessages = localStorage.getItem("messages");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (e) {
        console.error("Failed to parse saved messages:", e);
      }
    }
  }, []);

  // Restore active session from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem("activeSessionId");
    if (savedSessionId) {
      setActiveSessionId(savedSessionId);
    }
  }, []);

  // Save active session to localStorage
  useEffect(() => {
    if (activeSessionId && user?.user_id) {
      localStorage.setItem("activeSessionId", activeSessionId);
      localStorage.setItem("userId", user.user_id);
    }
  }, [activeSessionId, user?.user_id]);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // Load sessions from backend with fallback
  useEffect(() => {
    if (user) {
      loadSessions();
    } else {
      // Clear data on logout
      setSessions([]);
      setActiveSessionId(null);
      setMessages({});
      localStorage.removeItem("activeSessionId");
      localStorage.removeItem("userId");
      localStorage.removeItem("sessions_cache");
    }
  }, [user]);

  // Load messages when active session changes
  useEffect(() => {
    if (activeSessionId && !messages[activeSessionId]) {
      loadChatHistory(activeSessionId);
    }
  }, [activeSessionId]);

  const loadSessions = async () => {
    if (!user) return;

    setIsLoadingSessions(true);
    try {
      const backendSessions = await api.getSessions(user.user_id);
      const formattedSessions: ChatSession[] = backendSessions.map(
        (session) => ({
          id: session.session_id,
          name: `Chat - ${session.pdf_filename}`,
          fileName: session.pdf_filename,
          createdAt: new Date(session.created_at),
        }),
      );
      setSessions(formattedSessions);
      localStorage.setItem("sessions_cache", JSON.stringify(backendSessions));
    } catch (error) {
      console.error("Failed to load sessions from backend:", error);

      const cachedSessions = localStorage.getItem("sessions_cache");
      if (cachedSessions) {
        try {
          const parsed = JSON.parse(cachedSessions);
          const formattedSessions: ChatSession[] = parsed.map(
            (session: any) => ({
              id: session.session_id,
              name: `Chat - ${session.pdf_filename}`,
              fileName: session.pdf_filename,
              createdAt: new Date(session.created_at),
            }),
          );
          setSessions(formattedSessions);
          console.warn("Restored sessions from cache due to API failure");
        } catch (e) {
          console.error("Failed to parse cached sessions:", e);
        }
      }
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadChatHistory = async (sessionId: string) => {
    try {
      const history = await api.getChatHistory(sessionId);
      const formattedMessages: Message[] = history.messages.map((msg) => ({
        id: crypto.randomUUID(),
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages((prev) => ({
        ...prev,
        [sessionId]: formattedMessages,
      }));
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setMessages((prev) => ({
        ...prev,
        [sessionId]: [],
      }));
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const handleUpload = async (file: File) => {
    if (!user) return;

    setIsUploadingPDF(true);
    try {
      const response = await api.uploadPDF(file, user.user_id);

      const newSession: ChatSession = {
        id: response.session_id,
        name: `Chat - ${response.pdf_filename}`,
        fileName: response.pdf_filename,
        createdAt: new Date(),
      };

      const updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      setActiveSessionId(response.session_id);
      setMessages({ ...messages, [response.session_id]: [] });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload PDF. Please try again.");
    } finally {
      setIsUploadingPDF(false);
    }
  };

  const handleNewSession = () => {
    setActiveSessionId(null);
    setSidebarOpen(false);
  };

  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setSidebarOpen(false);
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await api.deleteSession(sessionId);

      const updatedSessions = sessions.filter((s) => s.id !== sessionId);
      setSessions(updatedSessions);

      const newMessages = { ...messages };
      delete newMessages[sessionId];
      setMessages(newMessages);

      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
      alert("Failed to delete session. Please try again.");
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeSessionId || !user || isSendingMessage) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages({
      ...messages,
      [activeSessionId]: [...(messages[activeSessionId] || []), userMessage],
    });

    setIsSendingMessage(true);
    try {
      const response = await api.sendMessage(
        activeSessionId,
        user.user_id,
        content,
      );

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.assistant_message,
        timestamp: new Date(response.timestamp),
      };

      setMessages((prev) => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), assistantMessage],
      }));
    } catch (error) {
      console.error("Failed to send message:", error);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Sorry, I encountered an error processing your message. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), errorMessage],
      }));
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop Sidebar ── */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col border-r border-border transition-all duration-200 ease-out bg-sidebar flex-shrink-0",
          isSidebarCollapsed ? "lg:w-[64px]" : "lg:w-[260px]",
        )}
      >
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          isLoading={isLoadingSessions}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden animate-slide-in-left">
            <ChatSidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSessionSelect={handleSessionSelect}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              isLoading={isLoadingSessions}
              isCollapsed={false}
            />
          </div>
        </>
      )}

      {/* ── Main Area ── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 lg:hidden">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>

        {/* Desktop top bar */}
        <div className="hidden items-center justify-end gap-1.5 border-b border-border bg-background px-4 py-3 lg:flex">
          <ThemeToggle />
          <UserProfile />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeSession ? (
            <ChatInterface
              messages={messages[activeSessionId!] || []}
              fileName={activeSession.fileName}
              onSendMessage={handleSendMessage}
              isLoading={isSendingMessage}
            />
          ) : (
            <PdfUpload onUpload={handleUpload} isUploading={isUploadingPDF} />
          )}
        </div>
      </div>
    </div>
  );
}
