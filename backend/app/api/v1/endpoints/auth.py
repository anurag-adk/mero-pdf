from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from bson import ObjectId

from backend.app.core import security
from backend.app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from backend.app.core.database import get_database
from backend.app.schemas import Token, UserCreate, UserLogin, UserResponse
from backend.app.models import User

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
async def signup(user_in: UserCreate, db = Depends(get_database)) -> Any:
    """
    Create new user
    """
    user = await db.users.find_one({"email": user_in.email})
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    user_obj = User(
        user_id=str(ObjectId()), # Generate a unique user_id
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
    )
    
    new_user = await db.users.insert_one(user_obj.model_dump(by_alias=True, exclude=["id"]))
    created_user = await db.users.find_one({"_id": new_user.inserted_id})
    
    return UserResponse(**created_user)

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db = Depends(get_database)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await db.users.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not security.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
