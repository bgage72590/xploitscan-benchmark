# Background worker that sends user documents to the ML inference service on
# another host. The channel has no TLS, so document text and the bearer token
# in the call metadata travel in plaintext. VC096 must fire.
import os

import grpc

from protos import inference_pb2, inference_pb2_grpc

INFERENCE_ADDR = os.environ.get("INFERENCE_ADDR", "inference.internal.example.com:50051")


def summarize(document_text: str) -> str:
    with grpc.insecure_channel(INFERENCE_ADDR) as channel:
        stub = inference_pb2_grpc.InferenceStub(channel)
        response = stub.Summarize(
            inference_pb2.SummarizeRequest(text=document_text),
            metadata=[("authorization", f"Bearer {os.environ['INFERENCE_TOKEN']}")],
            timeout=30,
        )
        return response.summary
