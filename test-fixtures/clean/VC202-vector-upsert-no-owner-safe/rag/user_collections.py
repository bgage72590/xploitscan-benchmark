"""One Chroma collection per user, so a search only ever sees its owner's notes."""
import os
from uuid import uuid4

import chromadb

client = chromadb.PersistentClient(path=os.environ.get("CHROMA_PATH", "./chroma"))


def add_notes(user_id: int, chunks: list[str]) -> int:
    collection = client.get_or_create_collection(name=f"user_{user_id}_notes")
    collection.add(ids=[str(uuid4()) for _ in chunks], documents=chunks)
    return len(chunks)
