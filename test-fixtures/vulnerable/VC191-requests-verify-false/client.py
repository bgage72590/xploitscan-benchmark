# requests with verify=False — TLS validation disabled, MITM possible.
# VC191 must fire.
import requests


def fetch_user_data(user_id: str) -> dict:
    # AI-generated workaround for a self-signed cert error in dev that
    # never got removed before shipping.
    response = requests.get(
        f"https://api.example.com/users/{user_id}",
        verify=False,
    )
    return response.json()
