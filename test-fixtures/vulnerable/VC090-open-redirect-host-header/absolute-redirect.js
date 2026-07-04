// Building an absolute redirect URL from the Host header. Proxies can
// forward arbitrary Host values, letting an attacker control the
// eventual redirect target. VC090 must fire.

function buildCallbackUrl(req, res) {
  const host = req.headers.host;
  const callback = `https://${host}/callback?token=${req.query.t}`;
  return res.redirect(callback);
}

module.exports = { buildCallbackUrl };
