import ssl

import httpx

# The partner's billing API still runs on an old load balancer; without this
# the handshake fails with SSL: UNSUPPORTED_PROTOCOL.
ctx = ssl.create_default_context()
ctx.minimum_version = ssl.TLSVersion.TLSv1

client = httpx.Client(base_url="https://billing.partner.example", verify=ctx, timeout=10)


def fetch_invoices(account_id: str) -> list[dict]:
    resp = client.get(f"/v1/accounts/{account_id}/invoices")
    resp.raise_for_status()
    return resp.json()["invoices"]
