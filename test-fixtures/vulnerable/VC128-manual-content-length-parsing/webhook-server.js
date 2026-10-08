// Minimal webhook receiver (no framework) that sits behind the nginx ingress.
const http = require("http");
const crypto = require("crypto");

const SECRET = process.env.GITHUB_WEBHOOK_SECRET;

function readBody(req) {
  return new Promise((resolve, reject) => {
    const contentLength = parseInt(req.headers["content-length"], 10);
    const body = Buffer.alloc(contentLength);
    let offset = 0;
    req.on("data", (chunk) => {
      chunk.copy(body, offset);
      offset += chunk.length;
      if (offset >= contentLength) resolve(body);
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/webhooks/github") {
    res.writeHead(404).end();
    return;
  }
  const body = await readBody(req);
  const expected = "sha256=" + crypto.createHmac("sha256", SECRET).update(body).digest("hex");
  const signature = req.headers["x-hub-signature-256"] || "";
  if (signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    res.writeHead(401).end();
    return;
  }
  const event = JSON.parse(body.toString("utf8"));
  console.log("received", req.headers["x-github-event"], event.action);
  res.writeHead(204).end();
});

server.listen(process.env.PORT || 8080);
