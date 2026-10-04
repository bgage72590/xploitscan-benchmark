import os
import uuid

from fastapi import APIRouter, UploadFile, HTTPException

router = APIRouter()
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")


@router.post("/upload")
async def upload(file: UploadFile):
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.bin")
    if not os.path.realpath(file_path).startswith(os.path.realpath(UPLOAD_DIR)):
        raise HTTPException(status_code=400, detail="Invalid path")
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"id": file_id}
