"""Chroma-backed store for the support bot's uploaded documents."""
import os

import chromadb
from chromadb.utils import embedding_functions

client = chromadb.PersistentClient(path=os.environ.get("CHROMA_PATH", "./chroma"))
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key=os.environ["OPENAI_API_KEY"], model_name="text-embedding-3-small"
)
collection = client.get_or_create_collection("uploads", embedding_function=openai_ef)


def chunk_text(text: str, size: int = 800, overlap: int = 100) -> list[str]:
    return [text[i : i + size] for i in range(0, len(text), size - overlap)]


def add_upload(user_id: int, upload_id: str, filename: str, text: str) -> int:
    chunks = chunk_text(text)
    metadatas = [{"upload_id": upload_id, "filename": filename, "chunk": i} for i in range(len(chunks))]
    collection.add(
        ids=[f"{upload_id}-{i}" for i in range(len(chunks))],
        documents=chunks,
        metadatas=metadatas,
    )
    return len(chunks)


def delete_upload(upload_id: str) -> None:
    collection.delete(where={"upload_id": upload_id})
