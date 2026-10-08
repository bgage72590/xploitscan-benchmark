"""Phone-call alerts for on-call staff when the payment queue backs up."""
import plivo

client = plivo.RestClient(auth_id="MADHR7Z20ML9BC779UW1", auth_token="baGZ0CxAQtMLSaoGHJv5kSm5dgXfeMIRliHuLseP")

ANSWER_URL = "https://ops.acme-labs.io/plivo/answer/queue-alert"


def call_on_call(phone_number: str) -> str:
    response = client.calls.create(
        from_="+14155550188",
        to_=phone_number,
        answer_url=ANSWER_URL,
        answer_method="GET",
    )
    return response.request_uuid
