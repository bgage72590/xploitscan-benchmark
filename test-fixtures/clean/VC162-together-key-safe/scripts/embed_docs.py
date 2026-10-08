"""Embeds the help-center articles with Together AI. The Together() client
reads TOGETHER_API_KEY from the environment by itself. VC162 must NOT fire.
"""
import json
import os

from together import Together

if "TOGETHER_API_KEY" not in os.environ:
    raise SystemExit("Set TOGETHER_API_KEY before running this script")

client = Together()


def embed(texts):
    res = client.embeddings.create(
        model="togethercomputer/m2-bert-80M-8k-retrieval",
        input=texts,
    )
    return [item.embedding for item in res.data]


if __name__ == "__main__":
    with open("articles.json") as f:
        articles = json.load(f)
    print(f"Embedded {len(embed([a['body'] for a in articles]))} articles")
