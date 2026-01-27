import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import SessionsList from './components/SessionsList';
import ChatInterface from './components/ChatInterface';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getUserSessions } from './services/api';

const MainApp = () => {
  const { logout, user } = useAuth();
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
      const userSessions = await getUserSessions();
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

  return (
    <div className="flex h-screen bg-slate-900">
      <SessionsList
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onSessionDeleted={handleSessionDeleted}
        onLogout={logout}
        userEmail={user?.email}
      />

      {!activeSessionId ? (
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      ) : (
        <ChatInterface
          sessionId={activeSessionId}
          pdfFilename={activeSession?.pdf_filename || 'PDF Chat'}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
