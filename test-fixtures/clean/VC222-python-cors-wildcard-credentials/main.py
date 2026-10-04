# FastAPI CORS configurations that do NOT echo arbitrary origins with
# credentials. VC222 must not fire on any of them.
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.environ["SESSION_SECRET"])

# The old wildcard is commented out; the live setting is an explicit list.
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
    allow_origins=["https://app.example.com", "https://admin.example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# Origins from the environment with no "*" fallback.
api = FastAPI()
api.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
)

# A wildcard WITHOUT credentials: browsers send no cookies, nothing to read.
public = FastAPI()
public.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET"])

# A wildcard only in the debug branch.
dev = FastAPI()
if os.getenv("DEBUG") == "1":
    dev.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True)
else:
    dev.add_middleware(CORSMiddleware, allow_origins=["https://app.example.com"], allow_credentials=True)

# A regex pinned to the app's own subdomains.
tenant = FastAPI()
tenant.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://[a-z0-9-]+\.example\.com",
    allow_credentials=True,
)
