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

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
DOCS_CACHE_PATH = PROCESSED_DATA_DIR / "docs_cache.pkl"

# Model Configs
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
LLM_MODEL_NAME = "llama-3.1-8b-instant"
QDRANT_COLLECTION_NAME = "pdf_chunks"

# Chunking Config
CHUNK_SIZE = 800
CHUNK_OVERLAP = 150
