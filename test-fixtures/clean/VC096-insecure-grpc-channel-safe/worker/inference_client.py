# Background worker that sends user documents to the ML inference service on
# another host. The channel is TLS-encrypted with the system root CAs, so
# document text and the bearer token in the call metadata are protected in
# transit. VC096 must NOT fire.
import os

import grpc

from protos import inference_pb2, inference_pb2_grpc

INFERENCE_ADDR = os.environ.get("INFERENCE_ADDR", "inference.internal.example.com:443")


def summarize(document_text: str) -> str:
    credentials = grpc.ssl_channel_credentials()
    with grpc.secure_channel(INFERENCE_ADDR, credentials) as channel:
        stub = inference_pb2_grpc.InferenceStub(channel)
        response = stub.Summarize(
            inference_pb2.SummarizeRequest(text=document_text),
            metadata=[("authorization", f"Bearer {os.environ['INFERENCE_TOKEN']}")],
            timeout=30,
        )
        return response.summary
