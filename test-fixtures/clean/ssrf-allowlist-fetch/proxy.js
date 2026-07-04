// Outbound fetch gated by a hostname allowlist. URL is parsed, the
// hostname is checked against a static set, and only whitelisted hosts
// proceed. VC041 must NOT fire.

const ALLOWED_HOSTS = new Set(["api.partner.com", "images.partner.com"]);

export async function proxyHandler(req, res) {
  let parsed;
  try {
    parsed = new URL(req.query.url);
  } catch {
    return res.status(400).json({ error: "invalid url" });
  }
  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return res.status(403).json({ error: "host not allowed" });
  }
  const response = await fetch(parsed.toString());
  res.send(await response.text());
}
