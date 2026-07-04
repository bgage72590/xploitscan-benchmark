// Log lines built from a trusted numeric userId and a sanitized
// username (newlines stripped, length-capped). Log forgery not
// possible. VC044 must NOT fire.

function sanitize(value) {
  return String(value ?? "").replace(/[\r\n]/g, " ").slice(0, 64);
}

function logLogin(user, req) {
  const username = sanitize(user.username);
  const userId = Number(user.id);
  console.log(`login ok user_id=${userId} username="${username}" ip=${sanitize(req.ip)}`);
}

module.exports = { logLogin };
