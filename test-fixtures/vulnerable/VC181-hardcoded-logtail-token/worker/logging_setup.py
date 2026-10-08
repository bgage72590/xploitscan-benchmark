import logging

from logtail import LogtailHandler

# Background worker logs go to the same Better Stack source as the API.
handler = LogtailHandler(
    source_token="texFTgP3KxWhCgehVdUDPBCl",
    host="https://s1290345.eu-nbg-2.betterstackdata.com",
)

logger = logging.getLogger("worker")
logger.setLevel(logging.INFO)
logger.handlers = []
logger.addHandler(handler)
