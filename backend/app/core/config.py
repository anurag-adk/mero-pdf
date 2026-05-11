import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API Keys
UNSTRUCTURED_API_KEY = os.getenv('UNSTRUCTURED_API_KEY')
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
QDRANT_URL = os.getenv('QDRANT_URL')
QDRANT_API_KEY = os.getenv('QDRANT_API_KEY')
MONGODB_URI = os.getenv('MONGODB_URI')
AZURE_STORAGE_CONNECTION_STRING = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
AZURE_CONTAINER_NAME = os.getenv('AZURE_CONTAINER_NAME')

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
DOCS_CACHE_PATH = PROCESSED_DATA_DIR / "docs_cache.pkl"
UPLOADS_DIR = DATA_DIR / "uploads"

# Ensure directories exist
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)

# Model Configs
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
LLM_MODEL_NAME = "llama-3.1-8b-instant"
QDRANT_COLLECTION_NAME = "pdf_chunks"

# Chunking Config
CHUNK_SIZE = 800
CHUNK_OVERLAP = 150

# Auth Config
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10
