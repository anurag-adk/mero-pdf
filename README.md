# Mero PDF

An intelligent document query system using Retrieval-Augmented Generation (RAG). Mero PDF allows you to upload PDF documents and have interactive conversations with them, powered by advanced AI.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Git Workflow](#git-workflow)
- [Dependencies](#dependencies)
- [Troubleshooting](#troubleshooting)

## Features

- **Multi-user support**: Each user can have multiple separate sessions.
- **Session-based chat**: Each PDF upload creates a new, isolated chat session.
- **Persistent chat history**: All conversations are stored in MongoDB.
- **Isolated vector stores**: Each session has its own Qdrant collection for precise retrieval.
- **Modern UI**: A premium, responsive React-based frontend.
- **RESTful API**: FastAPI-based backend for easy integration.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB (User/Session data), Qdrant (Vector Embeddings)
- **AI/ML**: 
  - **LangChain**: RAG framework
  - **Groq**: LLM provider
  - **Unstructured**: PDF processing

## Project Structure

```
mero_pdf/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── main.py          # Application entry point
│   │   ├── models.py        # Database models
│   │   └── ...
│   ├── data/                # Data storage
│   ├── notebooks/           # Jupyter notebooks for experiments
│   └── requirements.txt     # Python dependencies
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   └── ...
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
├── .env                     # Environment variables
└── README.md                # Project documentation
```

## Prerequisites

- **Python 3.12+**
- **Node.js 18+** & **npm**
- **Git**
- **MongoDB** (Atlas or local)
- **Qdrant** (Cloud or local)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mero_pdf
```

### Backend Setup

1. Create and activate a virtual environment on root directory:
   ```bash
   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate

   # Windows
   python -m venv venv
   venv\Scripts\activate
   ```

2. Configure environment variables in `.env` at the project root:
   ```env
   UNSTRUCTURED_API_KEY=your_key
   GROQ_API_KEY=your_key
   QDRANT_API_KEY=your_key
   QDRANT_URL=your_qdrant_url
   MONGODB_URI=your_mongodb_uri
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend Server
From the root directory (make sure venv is active):

```bash
python -m uvicorn backend.app.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

### Start the Frontend Client
From the `frontend` directory:

```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## API Documentation

Once the backend server is running, you can access the interactive API docs at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

- `POST /api/upload`: Upload a PDF and create a session.
- `POST /api/chat`: Send a message to the AI.
- `GET /api/sessions/{user_id}`: Get all sessions for a user.
- `GET /api/chat-history/{session_id}`: Get message history.
- `DELETE /api/session/{session_id}`: Delete a session.

## Git Workflow

We follow a feature-branch workflow.

1. **Update Main**: `git checkout main && git pull origin main`
2. **Create Branch**: `git checkout -b feature/your-feature-name`
3. **Commit Changes**: `git commit -m "Description of changes"`
4. **Push**: `git push -u origin feature/your-feature-name`
5. **Pull Request**: Open a PR on GitHub to merge into `main`.

### Branch Naming
- `feature/` for new features
- `bugfix/` for bug fixes
- `refactor/` for code improvements
- `docs/` for documentation updates

## Dependencies

### Backend
- `fastapi`, `uvicorn`: Web framework
- `langchain-*`: specialized LangChain packages
- `qdrant-client`: Vector database client
- `motor`: Async MongoDB driver
- `unstructured`: Document processing

### Frontend
- `react`, `react-dom`: UI library
- `vite`: Build tool
- `tailwindcss`: Styling
- `lucide-react`: Icons
- `axios`: API requests

## Troubleshooting

- **Virtual Environment**: Ensure you activate the venv before running backend commands.
- **CORS Errors**: Check if the backend allows requests from the frontend query origin.
- **Database Connection**: Verify your MongoDB URI and Qdrant credentials in `.env`.
