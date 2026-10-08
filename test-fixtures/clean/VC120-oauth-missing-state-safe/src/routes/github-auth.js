const crypto = require("crypto");
const express = require("express");
const { findOrCreateUserFromGitHub, createSession } = require("../lib/auth");

const router = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.APP_URL}/auth/github/callback`;

// Step 1: send the user to GitHub with an unguessable state bound to this browser
router.get("/auth/github", (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");
  res.cookie("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "read:user user:email",
    state,
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

// Step 2: GitHub redirects back with ?code=...&state=... — reject a state we did not issue
router.get("/auth/github/callback", async (req, res) => {
  const { code, state } = req.query;
  const expected = req.cookies.oauth_state;
  res.clearCookie("oauth_state");
  if (
    !code ||
    typeof state !== "string" ||
    !expected ||
    state.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(expected))
  ) {
    return res.status(400).send("Invalid OAuth state");
  }

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
