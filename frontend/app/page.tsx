"use client";

import { ChatInterface, type Message } from "@/components/chat-interface";
import { ChatSidebar, type ChatSession } from "@/components/chat-sidebar";
import { PdfUpload } from "@/components/pdf-upload";
import { LoginPage } from "@/components/login-page";
import { SignupPage } from "@/components/signup-page";
import { UserProfile } from "@/components/user-profile";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Menu, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isUploadingPDF, setIsUploadingPDF] = useState(false);

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
      // Cache sessions for offline/fallback use
      localStorage.setItem("sessions_cache", JSON.stringify(backendSessions));
    } catch (error) {
      console.error("Failed to load sessions from backend:", error);

      // Fallback: Try to restore from cached sessions
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
      // Initialize empty messages array if history fails to load
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
  };

  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId);
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

      // Add error message
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show auth pages if not logged in
  if (!user) {
    return authView === "login" ? (
      <LoginPage onSwitchToSignup={() => setAuthView("signup")} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthView("login")} />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Desktop */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:border-r lg:border-border transition-smooth bg-card",
          isSidebarCollapsed ? "lg:w-20" : "lg:w-80",
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

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-y-0 left-0 z-40 w-80 lg:hidden overflow-hidden">
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
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        </>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar with toggle and profile */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-9 w-9"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>

        {/* Desktop top bar just profile */}
        <div className="hidden lg:flex lg:items-center lg:justify-end lg:gap-2 border-b border-border bg-card px-4 py-3">
          <ThemeToggle />
          <UserProfile />
        </div>

        {/* Content area */}
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
