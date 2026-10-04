# Starlette with an origin regex that matches every origin, plus
# credentials — the same echo as allow_origins=["*"].
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

middleware = [
    Middleware(CORSMiddleware, allow_origin_regex=r".*", allow_credentials=True),
]

app = Starlette(middleware=middleware)
