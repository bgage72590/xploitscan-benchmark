"""Loads API keys from Google Secret Manager before the ingest runs. The map
pairs each env var the scripts read with the Secret Manager secret that
holds its value, so no key is stored in the repo. VC175 must NOT fire.
"""
import os

from google.cloud import secretmanager

PROJECT_ID = os.environ["GOOGLE_CLOUD_PROJECT"]

SECRET_IDS = {
    "WEAVIATE_API_KEY": "weaviate-api-key-production",
    "OPENAI_API_KEY": "openai-api-key-production",
}


def load_secrets() -> None:
    client = secretmanager.SecretManagerServiceClient()
    for env_var, secret_id in SECRET_IDS.items():
        name = f"projects/{PROJECT_ID}/secrets/{secret_id}/versions/latest"
        response = client.access_secret_version(request={"name": name})
        os.environ.setdefault(env_var, response.payload.data.decode("utf-8"))
