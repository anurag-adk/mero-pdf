import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth Endpoints
export const loginUser = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const signupUser = async (email, password) => {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
};

/**
 * Upload a PDF file and create a new session
 * @param {File} file - PDF file to upload
 * @returns {Promise} Response with session_id, message, and pdf_filename
 */
export const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

/**
 * Get all sessions for the authenticated user
 * @returns {Promise} Array of session objects
 */
export const getUserSessions = async () => {
    const response = await api.get('/sessions');
    return response.data;
};

/**
 * Send a chat message
 * @param {string} sessionId - Session identifier
 * @param {string} message - User message
 * @returns {Promise} Response with assistant's reply
 */
export const sendChatMessage = async (sessionId, message) => {
    const response = await api.post('/chat', {
        session_id: sessionId,
        user_id: "placeholder", // Backend handles real user_id via token, but schema might require it
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
 * @returns {Promise} Response with confirmation message
 */
export const deleteSession = async (sessionId) => {
    const response = await api.delete(`/session/${sessionId}`);
    return response.data;
};

export default api;
