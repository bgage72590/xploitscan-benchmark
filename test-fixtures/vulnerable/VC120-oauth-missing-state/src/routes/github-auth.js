const express = require("express");
const { findOrCreateUserFromGitHub, createSession } = require("../lib/auth");

const router = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.APP_URL}/auth/github/callback`;

// Step 1: send the user to GitHub to authorize the app
router.get("/auth/github", (req, res) => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "read:user user:email",
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

// Step 2: GitHub redirects back here with ?code=...
router.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Missing code");

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  const { access_token } = await tokenRes.json();

  const profileRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const profile = await profileRes.json();

  const user = await findOrCreateUserFromGitHub(profile);
  await createSession(res, user.id);
  res.redirect("/dashboard");
});

module.exports = router;
