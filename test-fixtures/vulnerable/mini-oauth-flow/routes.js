// OAuth callback flow. Two issues: client secret hardcoded (VC031),
// post-auth redirect honors a user-supplied `next` param (VC035).

const express = require("express");
const router = express.Router();

const OAUTH_CLIENT_SECRET = "secret-google-app-7c41a82bf3";

router.get("/oauth/callback", async (req, res) => {
  const { code, next } = req.query;
  const tokens = await exchangeCode(code, OAUTH_CLIENT_SECRET);
  await req.session.set({ user: tokens.user });
  res.redirect(next || "/dashboard");
});

async function exchangeCode(_code, _secret) {
  return { user: { id: 1 } };
}

module.exports = router;
