import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Upload a PDF file and create a new session
 * @param {string} userId - User identifier
 * @param {File} file - PDF file to upload
 * @returns {Promise} Response with session_id, message, and pdf_filename
 */
export const uploadPDF = async (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/upload?user_id=${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

/**
 * Get all sessions for a user
 * @param {string} userId - User identifier
 * @returns {Promise} Array of session objects
 */
export const getUserSessions = async (userId) => {
    const response = await api.get(`/sessions/${userId}`);
    return response.data;
};

/**
 * Send a chat message
 * @param {string} sessionId - Session identifier
 * @param {string} userId - User identifier
 * @param {string} message - User message
 * @returns {Promise} Response with assistant's reply
 */
export const sendChatMessage = async (sessionId, userId, message) => {
    const response = await api.post('/chat', {
        session_id: sessionId,
        user_id: userId,
        message: message,
    });

    return response.data;
};

/**
 * Get chat history for a session
 * @param {string} sessionId - Session identifier
 * @returns {Promise} Response with messages array
 */
export const getChatHistory = async (sessionId) => {
    const response = await api.get(`/chat-history/${sessionId}`);
    return response.data;
};

/**
 * Delete a session
 * @param {string} sessionId - Session identifier
 * @param {string} userId - User identifier
 * @returns {Promise} Response with confirmation message
 */
export const deleteSession = async (sessionId, userId) => {
    const response = await api.delete(`/session/${sessionId}?user_id=${userId}`);
    return response.data;
};

export default api;
