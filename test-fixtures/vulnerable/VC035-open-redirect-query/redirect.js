// res.redirect with a destination read straight from the query string.
// Classic open redirect — useful for phishing campaigns that leverage
// the victim domain. VC035 must fire.

function postLogin(req, res) {
  const next = req.query.next;
  // No allowlist, no origin check.
  return res.redirect(next);
}

module.exports = { postLogin };
