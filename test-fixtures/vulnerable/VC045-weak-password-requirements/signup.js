// Signup endpoint accepting 4-character passwords. OWASP floor is 8+
// with complexity, or 12+ without. VC045 must fire.

function validatePassword(password) {
  if (!password || password.length < 4) {
    return { ok: false, message: "Password too short" };
  }
  return { ok: true };
}

module.exports = { validatePassword };
