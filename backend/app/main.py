from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.database import Database
from backend.app.api.v1.api import api_router

# Initialize FastAPI app
app = FastAPI(
    title="Mero PDF Chat API",
    description="API for uploading PDFs and chatting with them using RAG",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Now valid with allow_credentials=False
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup/Shutdown events
@app.on_event("startup")
async def startup_db_client():
    """Connect to MongoDB on startup"""
    await Database.connect_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close MongoDB connection on shutdown"""
    await Database.close_db()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Mero PDF Chat API",
        "version": "1.0.0",
        "endpoints": {
            "upload": "/api/upload",
            "chat": "/api/chat",
            "sessions": "/api/sessions/{user_id}",
            "chat_history": "/api/chat-history/{session_id}",
            "delete_session": "/api/session/{session_id}"
        }
    }

# Include API router
app.include_router(api_router, prefix="/api")
