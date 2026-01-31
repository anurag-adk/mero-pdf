from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends
from langchain_core.messages import AIMessage, HumanMessage

from backend.app.core.database import get_database
from backend.app.models import ChatMessage, User
from backend.app.schemas import ChatRequest, ChatResponse, ChatHistoryResponse, MessageResponse
from backend.app.services.rag_service import initialize_rag_system, query_rag
from backend.app.core.globals import active_chains
from backend.app.api.deps import get_current_user
from backend.app.services.rag_service import initialize_rag_system, query_rag
from backend.app.core.globals import active_chains

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Chat with a PDF in a specific session.
    
    Args:
        request: ChatRequest with session_id, user_id, and message
        current_user: Authenticated user
    
    Returns:
        ChatResponse with assistant's reply
    """
    try:
        # Verify session exists and belongs to user
        session = await db.sessions.find_one({
            "session_id": request.session_id,
            "user_id": current_user.user_id
        })
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found or access denied")
        
        # Get or initialize RAG chain for this session
        if request.session_id not in active_chains:
            print(f"Loading RAG chain for session {request.session_id}...")
            rag_chain = initialize_rag_system(
                collection_name=session['qdrant_collection_name'],
                file_path=session.get('pdf_path')
            )
            active_chains[request.session_id] = rag_chain
        else:
            rag_chain = active_chains[request.session_id]
        
        # Get chat history from MongoDB
        messages = await db.chat_messages.find({
            "session_id": request.session_id
        }).sort("timestamp", 1).to_list(length=100)
        
        # Convert to LangChain message format
        chat_history = []
        for msg in messages:
            if msg['role'] == 'user':
                chat_history.append(HumanMessage(content=msg['content']))
            else:
                chat_history.append(AIMessage(content=msg['content']))
        
        # Query RAG system
        assistant_response = query_rag(rag_chain, request.message, chat_history)
        
        # Save user message to MongoDB
        user_message = ChatMessage(
            session_id=request.session_id,
            role="user",
            content=request.message
        )
        await db.chat_messages.insert_one(user_message.dict(by_alias=True))
        
        # Save assistant message to MongoDB
        assistant_message = ChatMessage(
            session_id=request.session_id,
            role="assistant",
            content=assistant_response
        )
        await db.chat_messages.insert_one(assistant_message.dict(by_alias=True))
        
        return ChatResponse(
            session_id=request.session_id,
            user_message=request.message,
            assistant_message=assistant_response,
            timestamp=datetime.utcnow()
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


@router.get("/chat-history/{session_id}", response_model=ChatHistoryResponse)
async def get_chat_history(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Get chat history for a session.
    
    Args:
        session_id: Session identifier
        current_user: Authenticated user
    
    Returns:
        ChatHistoryResponse with all messages
    """
    try:
        # Verify session exists and belongs to user
        session = await db.sessions.find_one({
            "session_id": session_id,
            "user_id": current_user.user_id
        })
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get messages
        messages = await db.chat_messages.find({
            "session_id": session_id
        }).sort("timestamp", 1).to_list(length=1000)
        
        message_list = [
            MessageResponse(
                role=msg['role'],
                content=msg['content'],
                timestamp=msg['timestamp']
            )
            for msg in messages
        ]
        
        return ChatHistoryResponse(
            session_id=session_id,
            messages=message_list
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat history: {str(e)}")
