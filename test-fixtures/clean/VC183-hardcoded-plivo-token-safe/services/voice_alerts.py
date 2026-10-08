"""Phone-call alerts for on-call staff when the payment queue backs up."""
import os

import plivo

client = plivo.RestClient(auth_id=os.environ["PLIVO_AUTH_ID"], auth_token=os.environ["PLIVO_AUTH_TOKEN"])

ANSWER_URL = "https://ops.acme-labs.io/plivo/answer/queue-alert"


def call_on_call(phone_number: str) -> str:
    response = client.calls.create(
        from_="+14155550188",
        to_=phone_number,
        answer_url=ANSWER_URL,
        answer_method="GET",
    )
    return response.request_uuid
