"""Vector store for the docs chatbot's retrieval step, on Qdrant Cloud.
The cluster URL and API key are passed inline to the client.
"""
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

client = QdrantClient(
    url="https://3f6a1c2e-acme.eu-central-1-0.aws.cloud.qdrant.io:6333",
    api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.FAKE0000FAKE0000FAKE0000FAKE0000FAKE0000FAK",
)

COLLECTION = "docs"


def ensure_collection(dim: int = 384) -> None:
    if not client.collection_exists(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
        )


def search(vector: list[float], limit: int = 5):
    return client.query_points(collection_name=COLLECTION, query=vector, limit=limit).points
