# Mero PDF Chat API

A FastAPI-based backend for uploading PDFs and chatting with them using RAG (Retrieval-Augmented Generation).

## Features

- **Multi-user support**: Each user can have multiple sessions
- **Session-based chat**: Each PDF upload creates a new session
- **Persistent chat history**: All conversations stored in MongoDB
- **Isolated vector stores**: Each session has its own Qdrant collection
- **RESTful API**: Easy to integrate with any frontend

## Architecture

- **FastAPI**: Web framework for building APIs
- **MongoDB**: Stores users, sessions, and chat history
- **Qdrant**: Vector database for document embeddings
- **LangChain**: RAG framework for document Q&A
- **Groq**: LLM provider for generating responses

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables in `.env`:
```bash
UNSTRUCTURED_API_KEY=your_key
GROQ_API_KEY=your_key
QDRANT_API_KEY=your_key
QDRANT_URL=your_qdrant_url
MONGODB_URI=your_mongodb_uri
```

## Running the API

Start the server:
```bash
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### 1. Upload PDF
**POST** `/api/upload`

Upload a PDF file and create a new chat session.

**Form Data:**
- `user_id`: User identifier (string)
- `file`: PDF file

**Response:**
```json
{
  "session_id": "uuid",
  "message": "PDF uploaded and processed successfully",
  "pdf_filename": "example.pdf"
}
```

### 2. Chat with PDF
**POST** `/api/chat`

Send a message and get a response based on the PDF content.

**Request Body:**
```json
{
  "session_id": "uuid",
  "user_id": "user123",
  "message": "What is this document about?"
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "user_message": "What is this document about?",
  "assistant_message": "This document is about...",
  "timestamp": "2024-01-26T12:00:00"
}
```

### 3. Get User Sessions
**GET** `/api/sessions/{user_id}`

Get all sessions for a specific user.

**Response:**
```json
[
  {
    "session_id": "uuid",
    "user_id": "user123",
    "pdf_filename": "example.pdf",
    "created_at": "2024-01-26T12:00:00",
    "message_count": 5
  }
]
```

### 4. Get Chat History
**GET** `/api/chat-history/{session_id}`

Get all messages for a specific session.

**Response:**
```json
{
  "session_id": "uuid",
  "messages": [
    {
      "role": "user",
      "content": "What is this about?",
      "timestamp": "2024-01-26T12:00:00"
    },
    {
      "role": "assistant",
      "content": "This is about...",
      "timestamp": "2024-01-26T12:00:01"
    }
  ]
}
```

### 5. Delete Session
**DELETE** `/api/session/{session_id}?user_id={user_id}`

Delete a session and all associated data.

**Response:**
```json
{
  "message": "Session deleted successfully",
  "session_id": "uuid"
}
```

## Testing with cURL

### Upload a PDF:
```bash
curl -X POST "http://localhost:8000/api/upload" \
  -F "user_id=user123" \
  -F "file=@/path/to/your.pdf"
```

### Chat with PDF:
```bash
curl -X POST "http://localhost:8000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "your-session-id",
    "user_id": "user123",
    "message": "What is this document about?"
  }'
```

### Get user sessions:
```bash
curl -X GET "http://localhost:8000/api/sessions/user123"
```

### Get chat history:
```bash
curl -X GET "http://localhost:8000/api/chat-history/your-session-id"
```

### Delete session:
```bash
curl -X DELETE "http://localhost:8000/api/session/your-session-id?user_id=user123"
```

## Project Structure

```
mero_pdf/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # MongoDB models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database connection
│   └── scripts/
│       ├── config.py        # Configuration
│       ├── utils.py         # Utility functions
│       └── inference.py     # RAG logic
├── data/
│   └── uploads/             # Uploaded PDFs
├── .env                     # Environment variables
└── requirements.txt         # Dependencies
```

## MongoDB Collections

### users
Stores user information.

### sessions
Stores session metadata (user_id, pdf_filename, qdrant_collection_name, etc.)

### chat_messages
Stores individual chat messages (session_id, role, content, timestamp)

## Notes

- Each PDF upload creates a new session with a unique Qdrant collection
- Chat history is preserved in MongoDB for each session
- Sessions can be deleted, which removes all associated data
- The API uses CORS middleware to allow cross-origin requests
