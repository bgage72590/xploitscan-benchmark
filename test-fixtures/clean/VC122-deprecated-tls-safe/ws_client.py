import ssl

import websockets

# PROTOCOL_SSLv23 is the old name for PROTOCOL_TLS: negotiate the highest
# version both sides support. Everything below TLS 1.2 is then switched off.
ctx = ssl.SSLContext(ssl.PROTOCOL_SSLv23)
ctx.options |= ssl.OP_NO_SSLv2 | ssl.OP_NO_SSLv3 | ssl.OP_NO_TLSv1 | ssl.OP_NO_TLSv1_1
ctx.verify_mode = ssl.CERT_REQUIRED
ctx.check_hostname = True
ctx.load_default_certs()


async def stream_prices(url: str):
    async with websockets.connect(url, ssl=ctx) as ws:
        async for message in ws:
            yield message
