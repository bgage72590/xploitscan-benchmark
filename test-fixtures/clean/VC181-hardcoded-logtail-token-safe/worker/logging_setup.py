import logging
import os

from logtail import LogtailHandler

# Background worker logs go to the same Better Stack source as the API.
handler = LogtailHandler(
    source_token=os.environ["BETTER_STACK_SOURCE_TOKEN"],
    host=os.environ["BETTER_STACK_INGESTING_URL"],
)

logger = logging.getLogger("worker")
logger.setLevel(logging.INFO)
logger.handlers = []
logger.addHandler(handler)
