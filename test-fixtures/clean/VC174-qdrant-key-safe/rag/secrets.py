"""Pulls the Qdrant connection settings from Azure Key Vault at startup. The
map pairs each env var with the name of the Key Vault secret that holds it;
the values never enter the repo. VC174 must NOT fire.
"""
import os

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

VAULT_URL = os.environ["AZURE_KEY_VAULT_URL"]

KEY_VAULT_SECRETS = {
    "QDRANT_URL": "acme-prod-qdrant-cluster-url",
    "QDRANT_API_KEY": "acme-prod-qdrant-cloud-api-key",
}


def load_qdrant_settings() -> None:
    client = SecretClient(vault_url=VAULT_URL, credential=DefaultAzureCredential())
    for env_var, secret_name in KEY_VAULT_SECRETS.items():
        os.environ.setdefault(env_var, client.get_secret(secret_name).value)
