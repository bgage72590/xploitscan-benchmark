import os
import tempfile
from uuid import uuid4

from fastapi import APIRouter, Depends, UploadFile
from langchain_community.document_loaders import PyPDFLoader
from langchain_openai import OpenAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone

from .auth import get_current_user

router = APIRouter()

pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
index = pc.Index("knowledge-base")
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vector_store = PineconeVectorStore(index=index, embedding=embeddings)
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)


@router.post("/api/upload")
async def upload_pdf(file: UploadFile, user=Depends(get_current_user)):
    with tempfile.NamedTemporaryFile(suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp.flush()
        pages = PyPDFLoader(tmp.name).load()

    chunks = splitter.split_documents(pages)
    for chunk in chunks:
        # Owner tag — retrieval filters on {"user_id": user.id}.
        chunk.metadata["user_id"] = str(user.id)
    ids = [str(uuid4()) for _ in chunks]
    vector_store.add_documents(documents=chunks, ids=ids)

    return {"filename": file.filename, "chunks": len(chunks)}
