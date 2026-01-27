import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendChatMessage, getChatHistory } from '../services/api';

export default function ChatInterface({ sessionId, pdfFilename }) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingHistory, setIsFetchingHistory] = useState(true);
    const messagesEndRef = useRef(null);

    // Fetch chat history when session changes
    useEffect(() => {
        const fetchHistory = async () => {
            setIsFetchingHistory(true);
            try {
                const history = await getChatHistory(sessionId);
                setMessages(history.messages || []);
            } catch (err) {
                console.error('Failed to fetch chat history:', err);
            } finally {
                setIsFetchingHistory(false);
            }
        };

        fetchHistory();
    }, [sessionId]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setIsLoading(true);

        // Optimistically add user message
        const tempUserMessage = {
            role: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, tempUserMessage]);

        try {
            const response = await sendChatMessage(sessionId, userMessage);

            // Add assistant message
            const assistantMessage = {
                role: 'assistant',
                content: response.assistant_message,
                timestamp: response.timestamp,
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            alert('Failed to send message: ' + (err.response?.data?.detail || err.message));
            // Remove optimistic user message on error
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingHistory) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Loading conversation...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-900 relative">
            {/* Header */}
            <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-10 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {pdfFilename}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 ml-4">AI Assistant Active</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-slate-700">
                            <Bot className="w-10 h-10 text-purple-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Ready to Chat</h3>
                        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                            Ask me anything about your PDF. I can summarize content, explain complex concepts, or find specific details for you.
                        </p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-4 max-w-4xl mx-auto ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700 shadow-sm mt-1">
                                    <Bot className="w-6 h-6 text-purple-400" />
                                </div>
                            )}

                            <div
                                className={`
                                    min-w-0 px-5 py-4 rounded-2xl shadow-sm
                                    ${message.role === 'user'
                                        ? 'bg-purple-600 text-white rounded-br-none'
                                        : 'bg-slate-800/50 text-slate-200 border border-slate-700 rounded-bl-none'
                                    }
                                `}
                            >
                                {message.role === 'assistant' ? (
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                                )}
                                <div className={`text-[10px] mt-2 opacity-60 ${message.role === 'user' ? 'text-purple-200' : 'text-slate-400'}`}>
                                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            {message.role === 'user' && (
                                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0 border border-slate-600 shadow-sm mt-1">
                                    <User className="w-6 h-6 text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className="flex gap-4 max-w-4xl mx-auto">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700 shadow-sm">
                            <Bot className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-3">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-sm text-slate-400 font-medium">Thinking...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-slate-900 border-t border-slate-800 p-4 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSendMessage} className="relative group">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask a question about your PDF..."
                            disabled={isLoading}
                            className="w-full bg-slate-800/50 text-slate-100 placeholder-slate-500 border border-slate-700 rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputMessage.trim()}
                            className="absolute right-2 top-2 p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all shadow-md group-focus-within:shadow-purple-500/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-slate-600 mt-3">
                        AI responses can be inaccurate. Double-check important information in the original PDF.
                    </p>
                </div>
            </div>
        </div>
    );
}
