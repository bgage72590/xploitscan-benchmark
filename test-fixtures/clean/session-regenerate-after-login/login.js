// Login that regenerates the session ID on successful auth. Session
// fixation closed. VC046 must NOT fire.

async function login(req, res) {
  const { username, password } = req.body;
  const user = await authenticate(username, password);
  if (!user) return res.status(401).json({ error: "invalid" });
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: "session_failed" });
    req.session.userId = user.id;
    res.json({ ok: true });
  });
}

module.exports = { login };
