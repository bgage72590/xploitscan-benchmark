// Google OAuth callback handler with the app's OAuth client secret committed
// into source instead of read from the environment.
// This should trigger VC119 (Hardcoded OAuth Client Secret).

const express = require("express");
const router = express.Router();

const oauthConfig = {
  client_id: "418000000000-fakeexampleclientid.apps.googleusercontent.com",
  client_secret: "FAKE0000EXAMPLE0000FAKE0000EXAMPLE",
  redirect_uri: "https://app.acme.dev/auth/google/callback",
};

router.get("/auth/google/callback", async (req, res) => {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: req.query.code,
      grant_type: "authorization_code",
      ...oauthConfig,
    }),
  });

  const tokens = await tokenRes.json();
  req.session.accessToken = tokens.access_token;
  res.redirect("/dashboard");
});

module.exports = router;
