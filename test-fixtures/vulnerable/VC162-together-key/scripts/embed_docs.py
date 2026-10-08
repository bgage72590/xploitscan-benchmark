"""One-off script that embeds the help-center articles with Together AI.

Written against an older account whose key is the legacy 64-char hex format.
This should trigger VC162 (Hardcoded Together AI API Key).
"""
import json

from together import Together

TOGETHER_API_KEY = "0000000000000000000000000000000000000000000000000000deadbeefcafe"

client = Together(api_key=TOGETHER_API_KEY)


def embed(texts):
    res = client.embeddings.create(
        model="togethercomputer/m2-bert-80M-8k-retrieval",
        input=texts,
    )
    return [item.embedding for item in res.data]


if __name__ == "__main__":
    with open("articles.json") as f:
        articles = json.load(f)
    vectors = embed([a["body"] for a in articles])
    print(f"Embedded {len(vectors)} articles")
