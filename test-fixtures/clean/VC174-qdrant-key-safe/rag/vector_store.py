"""Vector store for the docs chatbot's retrieval step, on Qdrant Cloud.
Connection details come from the environment. VC174 must NOT fire.
"""
import os

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

client = QdrantClient(
    url=os.environ["QDRANT_URL"],
    api_key=os.environ.get("QDRANT_API_KEY"),
)

COLLECTION = "docs"


def ensure_collection(dim: int = 384) -> None:
    if not client.collection_exists(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
        )
