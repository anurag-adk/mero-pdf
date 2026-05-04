const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface UserResponse {
  _id: string;
  user_id: string;
  email: string;
  created_at: string;
}

interface SessionResponse {
  session_id: string;
  user_id: string;
  pdf_filename: string;
  created_at: string;
  message_count: number;
}

interface MessageResponse {
  role: string;
  content: string;
  timestamp: string;
}

interface ChatHistoryResponse {
  session_id: string;
  messages: MessageResponse[];
}

interface ChatResponse {
  session_id: string;
  user_message: string;
  assistant_message: string;
  timestamp: string;
}

interface UploadResponse {
  session_id: string;
  message: string;
  pdf_filename: string;
}

class ApiService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem("access_token");
    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  }

  async signup(email: string, password: string): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Signup failed");
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    return response.json();
  }

  async uploadPDF(file: File, userId: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: this.getAuthHeader(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Upload failed");
    }

    return response.json();
  }

  async sendMessage(
    sessionId: string,
    userId: string,
    message: string,
  ): Promise<ChatResponse> {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({
        session_id: sessionId,
        user_id: userId,
        message: message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to send message");
    }

    return response.json();
  }

  async getSessions(userId: string): Promise<SessionResponse[]> {
    const response = await fetch(`${API_URL}/sessions/${userId}`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch sessions");
    }

    return response.json();
  }

  async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    const response = await fetch(`${API_URL}/chat-history/${sessionId}`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch chat history");
    }

    return response.json();
  }

  async deleteSession(sessionId: string): Promise<void> {
    const response = await fetch(`${API_URL}/session/${sessionId}`, {
      method: "DELETE",
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete session");
    }
  }
}

export const api = new ApiService();
export type {
  LoginResponse,
  UserResponse,
  SessionResponse,
  MessageResponse,
  ChatHistoryResponse,
  ChatResponse,
  UploadResponse,
};
