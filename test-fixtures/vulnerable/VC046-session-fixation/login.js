// Login handler that reuses the pre-auth session ID. An attacker who
// tricked the victim into loading a chosen session cookie now has a
// valid authenticated session after the victim logs in. VC046 must fire.

async function login(req, res) {
  const { username, password } = req.body;
  const user = await authenticate(username, password);
  if (!user) return res.status(401).json({ error: "invalid" });
  // Missing: req.session.regenerate(cb). Session ID is unchanged.
  req.session.userId = user.id;
  res.json({ ok: true });
}

module.exports = { login };
