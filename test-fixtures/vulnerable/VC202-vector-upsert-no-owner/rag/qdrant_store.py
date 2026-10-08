"""Qdrant store for the help-desk assistant's uploaded files."""
import os
from uuid import uuid4

from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct

openai_client = OpenAI()
client = QdrantClient(url=os.environ["QDRANT_URL"], api_key=os.environ.get("QDRANT_API_KEY"))


def index_upload(filename: str, chunks: list[str]) -> int:
    res = openai_client.embeddings.create(model="text-embedding-3-small", input=chunks)
    points = [
        PointStruct(id=str(uuid4()), vector=item.embedding, payload={"text": chunk, "filename": filename, "source": "user_upload"})
        for chunk, item in zip(chunks, res.data)
    ]
    client.upsert(collection_name="customer_docs", points=points)
    return len(points)
