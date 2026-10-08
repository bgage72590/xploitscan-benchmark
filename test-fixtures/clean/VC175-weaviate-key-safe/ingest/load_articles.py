"""Loads the article export into Weaviate Cloud. Credentials come from the
environment. VC175 must NOT fire.
"""
import json
import os

import weaviate
from weaviate.classes.init import Auth

client = weaviate.connect_to_weaviate_cloud(
    cluster_url=os.environ["WEAVIATE_URL"],
    auth_credentials=Auth.api_key(os.environ["WEAVIATE_API_KEY"]),
)

try:
    articles = client.collections.get("Article")
    with open("articles.json") as f, articles.batch.dynamic() as batch:
        for row in json.load(f):
            batch.add_object(properties={"title": row["title"], "body": row["body"]})
finally:
    client.close()
