// Counter-fixture for the environment-guarded Secure allowance. Widening
// VC017 to accept any value for that attribute must not also accept the one
// value that means the flag is off. The session cookie below rides in
// cleartext on any http request, so it is stealable on a shared network.
//
// (No flag-name-colon pair appears in this prose on purpose — the rule tests
// raw file content, comments included, so a comment quoting the pattern would
// satisfy the check and silence the fixture. It did, on the first draft.)

const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  const token = await mintSessionToken(req.body.email);

  res.cookie("sid", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  res.json({ ok: true });
});

module.exports = router;
