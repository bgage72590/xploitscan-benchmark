// Post-login redirect with a strict path allowlist. Absolute URLs and
// anything off-list get sent to the default dashboard. VC035 and VC090
// must NOT fire.

const ALLOWED_PATHS = new Set(["/dashboard", "/settings", "/onboarding"]);

function postLogin(req, res) {
  const next = typeof req.query.next === "string" ? req.query.next : "";
  if (next.startsWith("/") && !next.startsWith("//") && ALLOWED_PATHS.has(next)) {
    return res.redirect(next);
  }
  return res.redirect("/dashboard");
}

module.exports = { postLogin };
