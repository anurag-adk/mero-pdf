"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api, SessionResponse } from "@/lib/api";

interface SessionContextType {
  sessions: SessionResponse[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  isLoadingSessions: boolean;
  sessionLoadError: string | null;
  retryLoadSessions: () => Promise<void>;
  setSessions: (sessions: SessionResponse[]) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const SESSION_CACHE_KEY = "sessions_cache";
const ACTIVE_SESSION_KEY = "activeSessionId";
const USER_ID_KEY = "userId";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionLoadError, setSessionLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Restore from cache on mount
  useEffect(() => {
    const savedSessions =
      sessionStorage.getItem(SESSION_CACHE_KEY) ||
      localStorage.getItem(SESSION_CACHE_KEY);
    const savedSessionId = localStorage.getItem(ACTIVE_SESSION_KEY);

    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
      } catch (e) {
        console.error("Failed to parse cached sessions:", e);
      }
    }

    if (savedSessionId) {
      setActiveSessionId(savedSessionId);
    }
  }, []);

  const loadSessionsWithRetry = useCallback(
    async (userId: string, attempt = 1) => {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = Math.pow(2, attempt - 1) * 1000; // Exponential backoff: 1s, 2s, 4s

      try {
        setIsLoadingSessions(true);
        setSessionLoadError(null);

        const backendSessions = await api.getSessions(userId);
        setSessions(backendSessions);

        // Cache sessions in both sessionStorage (faster) and localStorage (persistence)
        sessionStorage.setItem(
          SESSION_CACHE_KEY,
          JSON.stringify(backendSessions),
        );
        localStorage.setItem(
          SESSION_CACHE_KEY,
          JSON.stringify(backendSessions),
        );

        setRetryCount(0);
      } catch (error) {
        console.error(`Failed to load sessions (attempt ${attempt}):`, error);

        // Try to restore from cache as fallback
        const cachedSessions =
          sessionStorage.getItem(SESSION_CACHE_KEY) ||
          localStorage.getItem(SESSION_CACHE_KEY);
        if (cachedSessions) {
          try {
            const parsed = JSON.parse(cachedSessions);
            setSessions(parsed);
            setSessionLoadError("Using cached sessions - offline mode");
            console.warn("Restored sessions from cache due to API failure");
          } catch (e) {
            console.error("Failed to parse cached sessions:", e);
          }
        }

        // Retry with exponential backoff
        if (attempt < MAX_RETRIES) {
          setRetryCount(attempt);
          setTimeout(() => {
            loadSessionsWithRetry(userId, attempt + 1);
          }, RETRY_DELAY);
        } else {
          setSessionLoadError(
            "Failed to load sessions. " +
              (cachedSessions
                ? "Using cached data."
                : "Please check your connection."),
          );
        }
      } finally {
        setIsLoadingSessions(false);
      }
    },
    [],
  );

  const retryLoadSessions = useCallback(async () => {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (userId) {
      await loadSessionsWithRetry(userId, 1);
    }
  }, [loadSessionsWithRetry]);

  return (
    <SessionContext.Provider
      value={{
        sessions,
        activeSessionId,
        setActiveSessionId,
        isLoadingSessions,
        sessionLoadError,
        retryLoadSessions,
        setSessions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
