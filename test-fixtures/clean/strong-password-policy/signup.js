// Signup with OWASP-style password policy: 12+ chars, mixed case, digit,
// symbol. VC045 must NOT fire.

const MIN_LENGTH = 12;
const COMPLEXITY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

function validatePassword(password) {
  if (!password || password.length < MIN_LENGTH) {
    return { ok: false, message: "Password must be at least 12 characters" };
  }
  if (!COMPLEXITY.test(password)) {
    return { ok: false, message: "Password must include upper, lower, digit, and symbol" };
  }
  return { ok: true };
}

module.exports = { validatePassword };
