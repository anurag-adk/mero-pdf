from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableParallel
from langchain_core.messages import AIMessage, HumanMessage
from langchain_classic.chains import create_history_aware_retriever
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

from backend.app.core.config import GROQ_API_KEY, LLM_MODEL_NAME
from backend.app.services.utils import get_embeddings, get_vectorstore, load_documents, split_documents, setup_vectorstore

def setup_chain(vectorstore):
    """
    Setup the RAG chain.
    """
    llm = ChatGroq(
        model=LLM_MODEL_NAME,
        api_key=GROQ_API_KEY,
        temperature=0
    )

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 2}
    )

    # Contextualize question prompt
    contextualize_q_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )
    
    contextualize_q_prompt = ChatPromptTemplate.from_messages([
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
    
    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )

    # Answer question prompt
    system_prompt = (
       "Instructions:\n"
        "1. Use ONLY the provided context to answer the user's query.\n"
        "2. Extract the answer strictly from the context. Do NOT infer, assume, or add missing details.\n"
        "3. Do NOT use external knowledge.\n"
        "4. You may rewrite the extracted content to improve grammar, clarity, and formatting, but DO NOT add new information.\n"
        "5. Present the answer in a clean, well-structured format using proper sentences and bullet points where necessary.\n"
        "6. If the answer is not explicitly present, reply exactly: \"The provided context does not contain this information.\"\n"
        "\n"
        "{context}"
    )

    qa_prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])

    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

    rag_chain = RunnableParallel({
        "context": history_aware_retriever,
        "input": lambda x: x["input"],
        "chat_history": lambda x: x["chat_history"],
    }).assign(answer=question_answer_chain)

    return rag_chain

def initialize_rag_system(file_path=None, collection_name=None, force_reload=False):
    """
    Initialize the RAG system for a specific session.
    Args:
        file_path: Path to the PDF file (local path or Azure Blob URL)
        collection_name: Qdrant collection name for this session
        force_reload: Force reload from API
    Returns:
        The RAG chain ready for queries.
    """
    print("Initializing RAG system...")
    embeddings = get_embeddings()
    
    # If collection_name is provided, try to use existing vectorstore
    if collection_name:
        try:
            vectorstore = get_vectorstore(embeddings, collection_name)
            print(f"Using existing vector store: {collection_name}")
            return setup_chain(vectorstore)
        except Exception as e:
            print(f"Error loading existing vectorstore: {e}")
            if not file_path:
                 raise Exception("file_path required to create new vectorstore")

    # Connect to Azure if needed
    temp_file_path = None
    process_path = file_path

    try:
        if file_path and (str(file_path).startswith('http://') or str(file_path).startswith('https://')):
            # It's a URL, download from Azure
            from backend.app.services.azure_service import azure_storage
            from backend.app.core.config import UPLOADS_DIR
            import uuid
            
            # Create a localized temp file path
            local_filename = f"temp_{uuid.uuid4()}.pdf"
            temp_file_path = UPLOADS_DIR / local_filename
            
            print(f"Downloading remote file to {temp_file_path}...")
            azure_storage.download_file(str(file_path), str(temp_file_path))
            process_path = temp_file_path

        # Load and process documents
        if process_path:
            docs = load_documents(file_path=process_path, force_reload=force_reload)
        else:
            docs = load_documents(force_reload=force_reload)
            
        chunked_docs = split_documents(docs)
        vectorstore = setup_vectorstore(chunked_docs, embeddings, collection_name=collection_name)

        chain = setup_chain(vectorstore)
        print("RAG system initialized successfully!\n")
        return chain

    finally:
        # cleanup temp file if we created one
        if temp_file_path and temp_file_path.exists():
            try:
                temp_file_path.unlink()
                print("Cleaned up temporary file")
            except Exception as e:
                print(f"Error deleting temp file: {e}")

def query_rag(chain, query, chat_history):
    """
    Execute a single query against the RAG chain.
    """
    response = chain.invoke({
        "input": query,
        "chat_history": chat_history
    })
    
    return response["answer"]
