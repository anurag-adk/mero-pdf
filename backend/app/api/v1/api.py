from fastapi import APIRouter
from backend.app.api.v1.endpoints import chat, sessions, upload

api_router = APIRouter()

api_router.include_router(upload.router, tags=["upload"])
api_router.include_router(chat.router, tags=["chat"])
api_router.include_router(sessions.router, tags=["sessions"])
