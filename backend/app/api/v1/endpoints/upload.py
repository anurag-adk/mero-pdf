import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from backend.app.core.database import get_database
from backend.app.core.config import UPLOADS_DIR
from backend.app.models import User, Session
from backend.app.schemas import UploadResponse
from backend.app.services.rag_service import initialize_rag_system
from backend.app.core.globals import active_chains
from backend.app.api.deps import get_current_user
from backend.app.schemas import UploadResponse
from backend.app.services.rag_service import initialize_rag_system
from backend.app.core.globals import active_chains
from backend.app.services.azure_service import azure_storage

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Upload a PDF file and create a new chat session.
    
    Args:
        file: PDF file to upload
        current_user: Authenticated user
    
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
        
        # Upload to Azure Blob Storage
        print(f"Uploading to Azure Blob Storage...")
        # Reset file pointer since it was read for local save
        await file.seek(0)
        azure_url = await azure_storage.upload_file(file, filename=f"{session_id}_{file.filename}")
        print(f"Uploaded to Azure: {azure_url}")

        # Store chain in memory
        active_chains[session_id] = rag_chain
        
        # Create or get user (already authenticated, but ensuring db sync if needed)
        # In this flow, we rely on the authenticated user.
        user_id = current_user.user_id
        
        # Verify user exists in DB (redundant if get_current_user does it, but keeping logic safe)
        # get_current_user already fetches the user, so we can just use current_user
        
        # Create session in MongoDB
        session = Session(
            session_id=session_id,
            user_id=user_id,
            pdf_filename=file.filename,
            pdf_path=azure_url, # Store Azure URL
            qdrant_collection_name=collection_name
        )
        await db.sessions.insert_one(session.dict(by_alias=True))
        
        # Clean up local file
        if file_path.exists():
            file_path.unlink()
            print("Cleaned up local file")

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
