"""Tiny event-ingest endpoint behind the load balancer (stdlib only)."""
import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer


class IngestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/events":
            self.send_response(404)
            self.end_headers()
            return
        content_length = int(self.headers['Content-Length'])
        payload = json.loads(self.rfile.read(content_length))
        with open("/var/data/events.jsonl", "a") as f:
            f.write(json.dumps(payload) + "\n")
        self.send_response(202)
        self.end_headers()


if __name__ == "__main__":
    HTTPServer(("0.0.0.0", int(os.environ.get("PORT", "8000"))), IngestHandler).serve_forever()
