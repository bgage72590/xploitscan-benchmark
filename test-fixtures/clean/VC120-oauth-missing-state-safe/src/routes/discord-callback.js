const express = require("express");
const { verifyOAuthState } = require("../middleware/oauth-state");
const { upsertDiscordUser, createSession } = require("../lib/auth");

const router = express.Router();

// Discord sends the user back here. verifyOAuthState has already compared the
// cookie with the query string before this handler runs.
router.get("/auth/discord/callback", verifyOAuthState, async (req, res) => {
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: `${process.env.APP_URL}/auth/discord/callback`,
    }),
  });
  if (!tokenRes.ok) return res.redirect("/auth?error=discord_token");

  const { access_token } = await tokenRes.json();
  const user = await upsertDiscordUser(access_token);
  await createSession(res, user.id);
  res.redirect("/dashboard");
});

module.exports = router;
