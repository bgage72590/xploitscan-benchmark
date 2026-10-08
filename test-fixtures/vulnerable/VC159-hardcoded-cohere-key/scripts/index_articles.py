"""Embed every help-center article and store the vectors in Postgres (pgvector).

Run after editing content: python scripts/index_articles.py
"""
import json
import os

import cohere
import psycopg

co = cohere.ClientV2(api_key="uauzYKkTCdnAWTPTms2q0P7rmRCQGRQKvANlVOH0")


def main():
    with open("content/articles.json") as f:
        articles = json.load(f)

    res = co.embed(
        model="embed-english-v3.0",
        input_type="search_document",
        embedding_types=["float"],
        texts=[a["title"] + "\n\n" + a["body"] for a in articles],
    )

    with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
        for article, vector in zip(articles, res.embeddings.float_):
            conn.execute(
                "UPDATE articles SET embedding = %s::vector WHERE id = %s",
                (str(vector), article["id"]),
            )
    print(f"Indexed {len(articles)} articles")


if __name__ == "__main__":
    main()
