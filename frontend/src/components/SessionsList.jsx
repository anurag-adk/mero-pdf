import { FileText, Trash2, Plus, MessageSquare, LogOut } from 'lucide-react';
import { deleteSession } from '../services/api';

export default function SessionsList({
    sessions,
    activeSessionId,
    onSelectSession,
    onNewSession,
    onSessionDeleted,
    onLogout,
    userEmail
}) {
    const handleDelete = async (sessionId, e) => {
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this session?')) {
            return;
        }

        try {
            await deleteSession(sessionId);
            onSessionDeleted(sessionId);
        } catch (err) {
            alert('Failed to delete session: ' + (err.response?.data?.detail || err.message));
        }
    };
    // ... (middle parts unchanged, or I should provide them for replace_file_content)


    return (
        <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full flex-shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight">Mero PDF</span>
                </div>

                <button
                    onClick={onNewSession}
                    className="w-full group flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition-all duration-200 font-medium border border-slate-700 hover:border-slate-600 shadow-sm hover:shadow-md"
                >
                    <Plus className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                    New Session
                </button>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                        Recent Chats
                    </h3>

                    {sessions.length === 0 ? (
                        <div className="text-center py-10 px-4 rounded-xl border-2 border-dashed border-slate-800 bg-slate-900/50">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageSquare className="w-6 h-6 text-slate-600" />
                            </div>
                            <p className="text-slate-400 font-medium text-sm">No conversations</p>
                            <p className="text-xs text-slate-600 mt-1">Upload a PDF to start</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {sessions.map((session) => (
                                <div
                                    key={session.session_id}
                                    onClick={() => onSelectSession(session.session_id)}
                                    className={`
                                        group relative p-3 rounded-xl cursor-pointer transition-all duration-200 border
                                        ${activeSessionId === session.session_id
                                            ? 'bg-purple-500/10 border-purple-500/50 shadow-md shadow-purple-500/5'
                                            : 'bg-transparent border-transparent hover:bg-slate-800 hover:border-slate-700'
                                        }
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 ${activeSessionId === session.session_id ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                            <FileText className="w-4 h-4" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${activeSessionId === session.session_id ? 'text-white' : 'text-slate-300 group-hover:text-white'
                                                }`}>
                                                {session.pdf_filename}
                                            </p>

                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[10px] text-slate-500">
                                                    {new Date(session.created_at).toLocaleDateString()}
                                                </span>
                                                {session.message_count > 0 && (
                                                    <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded-md">
                                                        <MessageSquare className="w-2.5 h-2.5" />
                                                        {session.message_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => handleDelete(session.session_id, e)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 rounded-lg transition-all duration-200 -mr-1"
                                            title="Delete session"
                                        >
                                            <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-400" />
                                        </button>
                                    </div>

                                    {activeSessionId === session.session_id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* User Profile / Footer */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                        {userEmail?.substring(0, 2).toUpperCase() || 'US'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{userEmail || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">Free Plan</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
