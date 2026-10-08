import os

from fastapi import APIRouter, Depends
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone
from pydantic import BaseModel

from .auth import get_current_user

router = APIRouter()

pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
vector_store = PineconeVectorStore(index=pc.Index("knowledge-base"), embedding=OpenAIEmbeddings())
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)


class Note(BaseModel):
    title: str
    text: str


@router.post("/api/notes")
async def add_note(note: Note, user=Depends(get_current_user)):
    metadata = {"user_id": str(user.id), "title": note.title}
    docs = splitter.create_documents([note.text], metadatas=[metadata])
    vector_store.add_documents(docs)
    return {"chunks": len(docs)}
