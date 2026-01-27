from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any
from datetime import datetime

# Import PyObjectId from models to reuse it
from backend.app.models import PyObjectId


class UploadResponse(BaseModel):
    """Response for PDF upload"""
    session_id: str
    message: str
    pdf_filename: str


class ChatRequest(BaseModel):
    """Request for chat endpoint"""
    session_id: str
    user_id: str
    message: str


class ChatResponse(BaseModel):
    """Response for chat endpoint"""
    session_id: str
    user_message: str
    assistant_message: str
    timestamp: datetime


class MessageResponse(BaseModel):
    """Individual message in chat history"""
    role: str
    content: str
    timestamp: datetime


class SessionResponse(BaseModel):
    """Session information"""
    session_id: str
    user_id: str
    pdf_filename: str
    created_at: datetime
    message_count: Optional[int] = 0


class ChatHistoryResponse(BaseModel):
    """Chat history for a session"""
    session_id: str
    messages: List[MessageResponse]


class DeleteResponse(BaseModel):
    """Response for delete operations"""
    message: str
    session_id: str


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class UserLogin(UserBase):
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class UserResponse(UserBase):
    id: PyObjectId = Field(alias="_id")
    user_id: str
    created_at: datetime
    
    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )
