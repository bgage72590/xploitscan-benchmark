// Login handler that honors a ?next= query param for post-login redirect
// without validating it against an allowlist. Classic open redirect — VC016.

import express from "express";
const router = express.Router();

router.post("/login", async (req, res) => {
  // ... authentication logic elided ...

  // Redirect straight to whatever the caller provided via query string. An
  // attacker can craft a link like /login?next=https://evil.com/fake-login to
  // land victims on a phishing page that looks like a continuation of this site.
  res.redirect(req.query.next);
});

export default router;
