// Webhook handler that pulls a URL out of the request body and issues an
// outbound request. Unvalidated host = SSRF. VC041 must fire.

const http = require("node:http");

module.exports = async function handleCallback(req, res) {
  const { callbackUrl } = req.body;
  http.get(callbackUrl, (upstream) => {
    let data = "";
    upstream.on("data", (chunk) => (data += chunk));
    upstream.on("end", () => res.json({ received: data.length }));
  });
};
