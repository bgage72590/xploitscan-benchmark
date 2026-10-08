const express = require("express");
const { upsertGoogleUser, createSession } = require("../lib/auth");

const router = express.Router();

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const REDIRECT_URI = `${process.env.APP_URL}/auth/google/callback`;

// Send the user to Google's consent screen
router.get("/auth/google", (req, res) => {
  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  res.redirect(url.toString());
});

// Google redirects back with ?code=... — exchanged without any state check
router.get("/auth/google/callback", async (req, res) => {
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: req.query.code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  const tokens = await tokenRes.json();
  const user = await upsertGoogleUser(tokens);
  await createSession(res, user.id);
  res.redirect("/dashboard");
});

module.exports = router;
