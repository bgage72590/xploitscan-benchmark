"""Support assistant backed by Mistral's chat API.

The key was copied in from the Mistral console so the script runs locally
without any setup, and the file was committed with it.
This should trigger VC161 (Hardcoded Mistral API Key).
"""
from mistralai import Mistral

MISTRAL_API_KEY = "FAKE0000FAKE0000FAKE0000FAKE0000"
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
