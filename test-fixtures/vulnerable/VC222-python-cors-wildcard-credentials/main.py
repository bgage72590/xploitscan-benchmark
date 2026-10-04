# FastAPI app with cookie sessions and a wildcard CORS policy that allows
# credentials. Starlette does not send "*" here: it echoes back whatever
# Origin the browser sends, with Access-Control-Allow-Credentials: true, so
# any website can make cookie-authenticated requests and read the responses.
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.environ["SESSION_SECRET"])

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/me")
async def me(request: Request):
    return {"user": request.session.get("user")}
