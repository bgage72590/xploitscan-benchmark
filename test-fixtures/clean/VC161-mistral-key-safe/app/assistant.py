"""Support assistant backed by Mistral's chat API.

The key comes from the environment (a .env file loaded locally, the host's
secret store in production). VC161 must NOT fire.
"""
import os

from mistralai import Mistral

MISTRAL_API_KEY = os.environ["MISTRAL_API_KEY"]
MODEL = "mistral-small-latest"

client = Mistral(api_key=MISTRAL_API_KEY)

SYSTEM_PROMPT = "You are a support agent for Acme Cloud. Answer in two sentences or fewer."


def answer(question: str) -> str:
    response = client.chat.complete(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": question},
        ],
    )
    return response.choices[0].message.content
