# gRPC channels for the notification worker. The flagd feature-flag sidecar
# runs in the worker's own pod, so its plaintext channel stays on loopback.
# The email service runs on another host, and its channel is plaintext too:
# recipient addresses and message bodies cross the network unencrypted.
# VC096 must fire on the email channel.
import os

import grpc

flags_channel = grpc.insecure_channel("localhost:8013")
email_channel = grpc.insecure_channel(os.environ["EMAIL_SERVICE_ADDR"])
