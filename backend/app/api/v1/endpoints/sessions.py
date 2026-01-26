from pathlib import Path
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from backend.app.core.database import get_database
from backend.app.schemas import SessionResponse, DeleteResponse
from backend.app.services.utils import delete_vectorstore
from backend.app.core.globals import active_chains

router = APIRouter()

@router.get("/sessions/{user_id}", response_model=List[SessionResponse])
async def get_user_sessions(
    user_id: str,
    db=Depends(get_database)
):
    """
    Get all sessions for a user.
    
    Args:
        user_id: User identifier
    
    Returns:
        List of SessionResponse objects
    """
    try:
        sessions = await db.sessions.find({
            "user_id": user_id
        }).sort("created_at", -1).to_list(length=100)
        
        # Get message counts for each session
        result = []
        for session in sessions:
            message_count = await db.chat_messages.count_documents({
                "session_id": session['session_id']
            })
            
            result.append(SessionResponse(
                session_id=session['session_id'],
                user_id=session['user_id'],
                pdf_filename=session['pdf_filename'],
                created_at=session['created_at'],
                message_count=message_count
            ))
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sessions: {str(e)}")


@router.delete("/session/{session_id}", response_model=DeleteResponse)
async def delete_session(
    session_id: str,
    user_id: str,
    db=Depends(get_database)
):
    """
    Delete a session and all associated data.
    
    Args:
        session_id: Session identifier
        user_id: User identifier (for authorization)
    
    Returns:
        DeleteResponse with confirmation message
    """
    try:
        # Verify session exists and belongs to user
        session = await db.sessions.find_one({
            "session_id": session_id,
            "user_id": user_id
        })
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found or access denied")
        
        # Delete chat messages
        await db.chat_messages.delete_many({"session_id": session_id})
        
        # Delete PDF file
        pdf_path = Path(session['pdf_path'])
        if pdf_path.exists():
            pdf_path.unlink()
        
        # Delete Qdrant collection
        delete_vectorstore(session['qdrant_collection_name'])
        
        # Remove from active chains
        if session_id in active_chains:
            del active_chains[session_id]
        
        # Delete session from MongoDB
        await db.sessions.delete_one({"session_id": session_id})
        
        return DeleteResponse(
            message="Session deleted successfully",
            session_id=session_id
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting session: {str(e)}")
