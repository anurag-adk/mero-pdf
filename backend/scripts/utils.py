import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

import pickle
from langchain_unstructured import UnstructuredLoader
from langchain_classic.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Qdrant

from backend.scripts.config import (
    UNSTRUCTURED_API_KEY,
    DOCS_CACHE_PATH,
    RAW_DATA_DIR,
    EMBEDDING_MODEL_NAME,
    QDRANT_URL,
    QDRANT_API_KEY,
    QDRANT_COLLECTION_NAME,
    CHUNK_SIZE,
    CHUNK_OVERLAP
)

def load_documents(file_name="finetunexlmr.pdf", force_reload=False):
    """
    Load documents from cache or via Unstructured API.
    """
    if not force_reload and DOCS_CACHE_PATH.exists():
        with open(DOCS_CACHE_PATH, 'rb') as f:
            docs = pickle.load(f)
        print("Loaded from cache")
        return docs
    
    file_path = RAW_DATA_DIR / file_name
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    # Ensure API Key is set for the loader process
    if UNSTRUCTURED_API_KEY:
        os.environ["UNSTRUCTURED_API_KEY"] = UNSTRUCTURED_API_KEY
    else:
        print("Warning: UNSTRUCTURED_API_KEY environment variable not set")

    print(f"Loading document from {file_path}...")
    loader = UnstructuredLoader(
        file_path=str(file_path),
        api_key=UNSTRUCTURED_API_KEY,
        partition_via_api=True,
    )
    docs = loader.load()
    
    # Save to cache
    DOCS_CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(DOCS_CACHE_PATH, 'wb') as f:
        pickle.dump(docs, f)
    print("Loaded from API and cached")
    
    return docs

def split_documents(docs):
    """
    Split documents into chunks.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", "? ", "! ", "; ", " ", ""],
        length_function=len,
    )
    chunked_docs = text_splitter.split_documents(docs)
    print(f"Split {len(docs)} documents into {len(chunked_docs)} chunks")
    return chunked_docs

def get_embeddings():
    """
    Initialize HuggingFace embeddings.
    """
    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL_NAME,
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )

def setup_vectorstore(chunked_docs, embeddings, force_recreate=True):
    """
    Setup Qdrant vector store.
    """
    vectorstore = Qdrant.from_documents(
        documents=chunked_docs,
        embedding=embeddings,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        collection_name=QDRANT_COLLECTION_NAME,
        force_recreate=force_recreate,
    )
    print(f"Added {len(chunked_docs)} documents to Qdrant collection '{QDRANT_COLLECTION_NAME}'")
    return vectorstore

def get_vectorstore(embeddings):
    """
    Get existing vector store instance.
    """
    return Qdrant.from_existing_collection(
        embedding=embeddings,
        collection_name=QDRANT_COLLECTION_NAME,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )
