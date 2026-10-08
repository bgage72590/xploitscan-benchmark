// Webhook receiver behind the nginx ingress. Body framing (Content-Length vs
// chunked Transfer-Encoding) is left to Node's HTTP parser via express.raw,
// which also enforces the size limit.
const express = require("express");
const crypto = require("crypto");

const SECRET = process.env.GITHUB_WEBHOOK_SECRET;
const app = express();

app.post(
  "/webhooks/github",
  express.raw({ type: "application/json", limit: "1mb" }),
  (req, res) => {
    const expected = "sha256=" + crypto.createHmac("sha256", SECRET).update(req.body).digest("hex");
    const signature = req.get("x-hub-signature-256") || "";
    if (signature.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return res.sendStatus(401);
    }
    const event = JSON.parse(req.body.toString("utf8"));
    console.log("received", req.get("x-github-event"), event.action);
    res.sendStatus(204);
  },
);

app.get("/healthz", (req, res) => {
  const body = JSON.stringify({ ok: true });
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Length", Buffer.byteLength(body));
  res.end(body);
});

app.listen(process.env.PORT || 8080);
