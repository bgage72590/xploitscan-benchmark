// Express handler that fetches an arbitrary URL from the query string.
// Classic SSRF — attacker can probe internal network (169.254.169.254,
// localhost:*, etc). VC041 must fire.

export async function proxyHandler(req, res) {
  const target = req.query.url;
  // No allowlist, no scheme check, no internal-IP block.
  const response = await fetch(target);
  const body = await response.text();
  res.send(body);
}
