'use client'

import { ChatInterface, type Message } from '@/components/chat-interface'
import { ChatSidebar, type ChatSession } from '@/components/chat-sidebar'
import { PdfUpload } from '@/components/pdf-upload'
import { LoginPage } from '@/components/login-page'
import { SignupPage } from '@/components/signup-page'
import { UserProfile } from '@/components/user-profile'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/lib/api'
import { Menu, X, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const { user, isLoading } = useAuth()
  const [authView, setAuthView] = useState<'login' | 'signup'>('login')
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [isUploadingPDF, setIsUploadingPDF] = useState(false)

  // Load sessions from backend
  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user])

  // Load messages when active session changes
  useEffect(() => {
    if (activeSessionId && !messages[activeSessionId]) {
      loadChatHistory(activeSessionId)
    }
  }, [activeSessionId])

  const loadSessions = async () => {
    if (!user) return
    
    setIsLoadingSessions(true)
    try {
      const backendSessions = await api.getSessions(user.user_id)
      const formattedSessions: ChatSession[] = backendSessions.map((session) => ({
        id: session.session_id,
        name: `Chat - ${session.pdf_filename}`,
        fileName: session.pdf_filename,
        createdAt: new Date(session.created_at),
      }))
      setSessions(formattedSessions)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setIsLoadingSessions(false)
    }
  }

  const loadChatHistory = async (sessionId: string) => {
    try {
      const history = await api.getChatHistory(sessionId)
      const formattedMessages: Message[] = history.messages.map((msg) => ({
        id: crypto.randomUUID(),
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }))
      setMessages((prev) => ({
        ...prev,
        [sessionId]: formattedMessages,
      }))
    } catch (error) {
      console.error('Failed to load chat history:', error)
      // Initialize empty messages array if history fails to load
      setMessages((prev) => ({
        ...prev,
        [sessionId]: [],
      }))
    }
  }

  const activeSession = sessions.find((s) => s.id === activeSessionId)

  const handleUpload = async (file: File) => {
    if (!user) return

    setIsUploadingPDF(true)
    try {
      const response = await api.uploadPDF(file, user.user_id)
      
      const newSession: ChatSession = {
        id: response.session_id,
        name: `Chat - ${response.pdf_filename}`,
        fileName: response.pdf_filename,
        createdAt: new Date(),
      }

      const updatedSessions = [newSession, ...sessions]
      setSessions(updatedSessions)
      setActiveSessionId(response.session_id)
      setMessages({ ...messages, [response.session_id]: [] })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload PDF. Please try again.')
    } finally {
      setIsUploadingPDF(false)
    }
  }

  const handleNewSession = () => {
    setActiveSessionId(null)
  }

  const handleSessionSelect = (sessionId: string) => {
    setActiveSessionId(sessionId)
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await api.deleteSession(sessionId)
      
      const updatedSessions = sessions.filter((s) => s.id !== sessionId)
      setSessions(updatedSessions)
      
      const newMessages = { ...messages }
      delete newMessages[sessionId]
      setMessages(newMessages)
      
      if (activeSessionId === sessionId) {
        setActiveSessionId(null)
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
      alert('Failed to delete session. Please try again.')
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!activeSessionId || !user || isSendingMessage) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages({
      ...messages,
      [activeSessionId]: [...(messages[activeSessionId] || []), userMessage],
    })

    setIsSendingMessage(true)
    try {
      const response = await api.sendMessage(activeSessionId, user.user_id, content)
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.assistant_message,
        timestamp: new Date(response.timestamp),
      }

      setMessages((prev) => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), assistantMessage],
      }))
    } catch (error) {
      console.error('Failed to send message:', error)
      
      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date(),
      }

      setMessages((prev) => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), errorMessage],
      }))
    } finally {
      setIsSendingMessage(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Show auth pages if not logged in
  if (!user) {
    return authView === 'login' ? (
      <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthView('login')} />
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar toggle */}
      <div className="fixed left-4 top-4 z-50 lg:hidden">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* User profile */}
      <div className="fixed right-4 top-4 z-50">
        <UserProfile />
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-40 lg:relative lg:z-0">
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
            isLoading={isLoadingSessions}
          />
        </div>
      )}

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {activeSession ? (
          <ChatInterface
            messages={messages[activeSessionId] || []}
            fileName={activeSession.fileName}
            onSendMessage={handleSendMessage}
            isLoading={isSendingMessage}
          />
        ) : (
          <PdfUpload onUpload={handleUpload} isUploading={isUploadingPDF} />
        )}
      </div>
    </div>
  )
}
