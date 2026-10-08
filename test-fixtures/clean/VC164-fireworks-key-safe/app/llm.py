"""FastAPI service that drafts product descriptions with a Fireworks-hosted
model. The key comes from the environment. VC164 must NOT fire.
"""
import os

from fastapi import FastAPI
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI(
    base_url="https://api.fireworks.ai/inference/v1",
    api_key=os.environ["FIREWORKS_API_KEY"],
)

FW_MODEL = "accounts/fireworks/models/llama-v3p1-70b-instruct"

app = FastAPI()


class DraftRequest(BaseModel):
    product_name: str
    features: list[str]


@app.post("/draft")
def draft(req: DraftRequest):
    completion = client.chat.completions.create(
        model=FW_MODEL,
        messages=[
            {"role": "system", "content": "Write a 60-word product description."},
            {"role": "user", "content": f"{req.product_name}: {', '.join(req.features)}"},
        ],
    )
    return {"description": completion.choices[0].message.content}
