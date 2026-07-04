// Login that doesn't regenerate the session ID after auth — session
// fixation surface (VC046).

async function login(req, res) {
  const { email, password } = req.body;
  const user = await db.findUserByEmail(email);
  if (!user || !(await db.verifyPassword(password, user.passwordHash))) {
    return res.status(401).json({ error: "invalid" });
  }
  req.session.userId = user.id;
  req.session.role = user.role;
  res.json({ ok: true });
}

module.exports = { login };
