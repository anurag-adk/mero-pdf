import { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import SessionsList from './components/SessionsList';
import ChatInterface from './components/ChatInterface';
import { getUserSessions } from './services/api';

// Hardcoded user ID for demo purposes
const USER_ID = 'demo-user-123';

function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  // Fetch sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const userSessions = await getUserSessions(USER_ID);
      setSessions(userSessions);

      // If there's an active session, make sure it still exists
      if (activeSessionId && !userSessions.find(s => s.session_id === activeSessionId)) {
        setActiveSessionId(null);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleUploadSuccess = (response) => {
    // Add new session and make it active
    fetchSessions();
    setActiveSessionId(response.session_id);
  };

  const handleNewSession = () => {
    setActiveSessionId(null);
  };

  const handleSessionDeleted = (sessionId) => {
    setSessions(prev => prev.filter(s => s.session_id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
  };

  const activeSession = sessions.find(s => s.session_id === activeSessionId);

  // Show upload screen if no active session
  if (!activeSessionId) {
    return (
      <div className="flex h-screen">
        {sessions.length > 0 && (
          <SessionsList
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onNewSession={handleNewSession}
            onSessionDeleted={handleSessionDeleted}
            userId={USER_ID}
          />
        )}
        <FileUpload userId={USER_ID} onUploadSuccess={handleUploadSuccess} />
      </div>
    );
  }

  // Show chat interface with sessions sidebar
  return (
    <div className="flex h-screen">
      <SessionsList
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onSessionDeleted={handleSessionDeleted}
        userId={USER_ID}
      />
      <ChatInterface
        sessionId={activeSessionId}
        userId={USER_ID}
        pdfFilename={activeSession?.pdf_filename || 'PDF Chat'}
      />
    </div>
  );
}

export default App;
