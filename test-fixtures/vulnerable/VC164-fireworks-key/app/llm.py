"""FastAPI service that drafts product descriptions with a Fireworks-hosted
model through Fireworks' OpenAI-compatible endpoint. The Fireworks key was
pasted into the client while testing and committed.
This should trigger VC164 (Hardcoded Fireworks AI API Key).
"""
from fastapi import FastAPI
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI(
    base_url="https://api.fireworks.ai/inference/v1",
    api_key="fw_FAKE0000FAKE0000FAKE0000",
)

app = FastAPI()


class DraftRequest(BaseModel):
    product_name: str
    features: list[str]


@app.post("/draft")
def draft(req: DraftRequest):
    completion = client.chat.completions.create(
        model="accounts/fireworks/models/llama-v3p1-70b-instruct",
        messages=[
            {"role": "system", "content": "Write a 60-word product description."},
            {"role": "user", "content": f"{req.product_name}: {', '.join(req.features)}"},
        ],
    )
    return {"description": completion.choices[0].message.content}
