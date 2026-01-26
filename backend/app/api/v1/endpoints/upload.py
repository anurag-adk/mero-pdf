import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from backend.app.core.database import get_database
from backend.app.core.config import UPLOADS_DIR
from backend.app.models import User, Session
from backend.app.schemas import UploadResponse
from backend.app.services.rag_service import initialize_rag_system
from backend.app.core.globals import active_chains

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_pdf(
    user_id: str,
    file: UploadFile = File(...),
    db=Depends(get_database)
):
    """
    Upload a PDF file and create a new chat session.
    
    Args:
        user_id: User identifier
        file: PDF file to upload
    
    Returns:
        UploadResponse with session_id and message
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Generate unique session ID
        session_id = str(uuid.uuid4())
        
        # Save uploaded file
        file_path = UPLOADS_DIR / f"{session_id}_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create Qdrant collection name for this session
        collection_name = f"session_{session_id}"
        
        # Initialize RAG system for this session
        print(f"Processing PDF for session {session_id}...")
        rag_chain = initialize_rag_system(
            file_path=str(file_path),
            collection_name=collection_name,
            force_reload=True
        )
        
        # Store chain in memory
        active_chains[session_id] = rag_chain
        
        # Create or get user
        user = await db.users.find_one({"user_id": user_id})
        if not user:
            user_doc = User(user_id=user_id)
            await db.users.insert_one(user_doc.dict(by_alias=True))
        
        # Create session in MongoDB
        session = Session(
            session_id=session_id,
            user_id=user_id,
            pdf_filename=file.filename,
            pdf_path=str(file_path),
            qdrant_collection_name=collection_name
        )
        await db.sessions.insert_one(session.dict(by_alias=True))
        
        return UploadResponse(
            session_id=session_id,
            message="PDF uploaded and processed successfully",
            pdf_filename=file.filename
        )
    
    except Exception as e:
        # Clean up on error
        if 'file_path' in locals() and file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
