import os
import pickle
# from langchain.schema import Document
from langchain_unstructured import UnstructuredLoader
from langchain_classic.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.vectorstores import Qdrant
from qdrant_client import QdrantClient
from langchain_qdrant import QdrantVectorStore


from backend.app.core.config import (
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

class DocumentClass:
    def __init__(self, page_content: str, metadata: dict = None):
        self.page_content = page_content
        self.metadata = metadata or {}


def load_documents(file_path=None, force_reload=False):
    """
    Load documents from cache or via Unstructured API.
    Args:
        file_path: Path to the PDF file (can be string or Path object)
        force_reload: Force reload from API even if cached
    """
    # If no file_path provided, use default
    if file_path is None:
        file_path = RAW_DATA_DIR / "finetunexlmr.pdf"
    else:
        # Convert string to Path if needed
        from pathlib import Path
        if isinstance(file_path, str):
            file_path = Path(file_path)
    
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
    
    print(f"Loaded {len(docs)} documents from API")
    
    return docs

def split_documents(docs, merge_pages=True):
    """
    Split documents into chunks.

    For tiny docs, merging all pages first and then splitting helps create larger chunks, 
    which works better for similarity search since we usually select only a few chunks.
    
    Args:
        docs: List of Document objects (each page may be a separate doc)
        merge_pages: If True, merge all docs before splitting

    Returns:
        List of chunked Document objects
    """
    if merge_pages:
        full_text = "\n".join([doc.page_content.strip() for doc in docs if doc.page_content.strip()])
        docs_to_split = [DocumentClass(page_content=full_text, metadata={})]
    else:
        docs_to_split = docs

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", "? ", "! ", "; ", " ", ""],
        length_function=len,
    )
    chunked_docs = text_splitter.split_documents(docs_to_split)
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

def setup_vectorstore(chunked_docs, embeddings, collection_name=None):
    """
    Setup Qdrant vector store.
    Args:
        chunked_docs: List of chunked documents
        embeddings: Embedding model
        collection_name: Custom collection name (defaults to QDRANT_COLLECTION_NAME)
        force_recreate: Whether to recreate the collection
    """
    if collection_name is None:
        collection_name = QDRANT_COLLECTION_NAME
    
    vectorstore = QdrantVectorStore.from_documents(
        documents=chunked_docs,
        embedding=embeddings,
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        collection_name=collection_name,
    )
    print(f"Added {len(chunked_docs)} documents to Qdrant collection '{collection_name}'")
    return vectorstore

def get_vectorstore(embeddings, collection_name=None):
    """
    Get existing vector store instance.
    Args:
        embeddings: Embedding model
        collection_name: Custom collection name (defaults to QDRANT_COLLECTION_NAME)
    """
    if collection_name is None:
        collection_name = QDRANT_COLLECTION_NAME

    client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
        prefer_grpc=False,
        check_compatibility=False,
    )
    
    # return Qdrant.from_existing_collection(
    #     embedding=embeddings,
    #     collection_name=collection_name,
    #     url=QDRANT_URL,
    #     api_key=QDRANT_API_KEY,
    # )

    return QdrantVectorStore(
        client=client,
        embedding=embeddings,
        collection_name=collection_name,
    )


def delete_vectorstore(collection_name):
    """
    Delete a vector store collection.
    Args:
        collection_name: Name of the collection to delete
    """
    from qdrant_client import QdrantClient
    
    client = QdrantClient(
        url=QDRANT_URL,
        api_key=QDRANT_API_KEY,
    )
    
    try:
        client.delete_collection(collection_name)
        print(f"Deleted Qdrant collection '{collection_name}'")
        return True
    except Exception as e:
        print(f"Error deleting collection '{collection_name}': {e}")
        return False
