"""Loads the article export into Weaviate Cloud. The admin key is passed
inline to Auth.api_key(), as in the connection quickstart with the env
lookup swapped for the literal key.
"""
import json

import weaviate
from weaviate.classes.init import Auth

client = weaviate.connect_to_weaviate_cloud(
    cluster_url="https://rx8ja1qxtkmhc0bqbyw7aq.c0.us-west3.gcp.weaviate.cloud",
    auth_credentials=Auth.api_key("FAKE0000FAKE0000FAKE0000FAKE0000FAKE0000"),
)

try:
    articles = client.collections.get("Article")
    with open("articles.json") as f, articles.batch.dynamic() as batch:
        for row in json.load(f):
            batch.add_object(properties={"title": row["title"], "body": row["body"]})
finally:
    client.close()
