import ssl

import httpx

# Refuse anything older than TLS 1.2 when talking to the partner's billing API.
ctx = ssl.create_default_context()
ctx.minimum_version = ssl.TLSVersion.TLSv1_2

client = httpx.Client(base_url="https://billing.partner.example", verify=ctx, timeout=10)


def fetch_invoices(account_id: str) -> list[dict]:
    resp = client.get(f"/v1/accounts/{account_id}/invoices")
    resp.raise_for_status()
    return resp.json()["invoices"]
