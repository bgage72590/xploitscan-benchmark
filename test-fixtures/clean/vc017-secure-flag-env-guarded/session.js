// All three cookie flags are set. The Secure attribute is environment-guarded
// because a Secure cookie is simply not sent over plain http, so hardcoding it
// on means the cookie never arrives during local development against
// http://localhost. Guarding it on NODE_ENV is the standard idiom in every
// Express and Next.js codebase, not a missing flag.
//
// VC017 must not fire: reporting "add missing cookie flags" here is factually
// wrong — the attribute is set, in production, which is where it matters.
//
// (Deliberately no literal flag-name-colon-true anywhere in this prose. The
// rule tests raw file content, comments included, so a comment quoting the
// safe form would satisfy the check and make this fixture pass for the wrong
// reason. It did, on the first draft.)

const express = require("express");
const router = express.Router();

const IS_PROD = process.env.NODE_ENV === "production";

router.post("/session", async (req, res) => {
  const token = await mintSessionToken(req.body.userId);

  res.cookie("sid", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    path: "/",
    maxAge: 60 * 60 * 1000,
  });

  res.json({ ok: true });
});

router.post("/session/refresh", async (req, res) => {
  const token = await mintSessionToken(req.user.id);

  res.cookie("sid", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ ok: true });
});

module.exports = router;
