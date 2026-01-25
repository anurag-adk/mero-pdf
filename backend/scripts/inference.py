import os
import sys

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableParallel
from langchain_core.messages import AIMessage, HumanMessage
from langchain_classic.chains import create_history_aware_retriever
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

from backend.scripts.config import GROQ_API_KEY, LLM_MODEL_NAME
from backend.scripts.utils import get_embeddings, get_vectorstore, load_documents, split_documents, setup_vectorstore

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
        "1. Use the provided context to answer the user's query\n"
        "2. If the context contains related information, use it to answer as best as you can\n"
        "3. Only say you don't have information if the context is completely unrelated\n"
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

def initialize_rag_system(force_reload=False):
    """
    Initialize the RAG system once at the start.
    Returns the RAG chain ready for queries.
    """
    print("Initializing RAG system...")
    embeddings = get_embeddings()
    
    # Try to get existing vector store, or recreate if needed/forced
    try:
        if force_reload:
            raise Exception("Force reload requested")
        vectorstore = get_vectorstore(embeddings)
        print("Using existing vector store")
    except Exception:
        print("Creating new vector store...")
        docs = load_documents(force_reload=force_reload)
        chunked_docs = split_documents(docs)
        vectorstore = setup_vectorstore(chunked_docs, embeddings)

    chain = setup_chain(vectorstore)
    print("RAG system initialized successfully!\n")
    
    return chain

def query_rag(chain, query, chat_history):
    """
    Execute a single query against the RAG chain.
    """
    response = chain.invoke({
        "input": query,
        "chat_history": chat_history
    })
    
    return response["answer"]

if __name__ == "__main__":
    # Initialize RAG system once
    rag_chain = initialize_rag_system()
    
    # Chat loop
    chat_history = []
    
    while True:
        query = input("\nEnter your question (or 'q' to quit): ")
        if query.lower() == 'q':
            break
            
        result = query_rag(rag_chain, query, chat_history)
        print(f"\nAnswer: {result}")
        
        chat_history.extend([
            HumanMessage(content=query),
            AIMessage(content=result)
        ])
