from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from backend.app.core.config import MONGODB_URI

class Database:
    """MongoDB database connection manager"""
    client: Optional[AsyncIOMotorClient] = None
    
    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB"""
        if cls.client is None:
            cls.client = AsyncIOMotorClient(MONGODB_URI)
            print("Connected to MongoDB")
    
    @classmethod
    async def close_db(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            print("Closed MongoDB connection")
    
    @classmethod
    def get_db(cls):
        """Get database instance"""
        if cls.client is None:
            raise Exception("Database not connected. Call connect_db() first.")
        return cls.client.mero_pdf


# Database instance
db = Database()


async def get_database():
    """Dependency to get database instance"""
    return db.get_db()
