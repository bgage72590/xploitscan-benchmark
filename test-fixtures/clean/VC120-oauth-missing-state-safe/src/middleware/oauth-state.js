const crypto = require("crypto");

const COOKIE = "oauth_state";

// Issue an unguessable state for the authorize redirect and bind it to this browser.
function issueOAuthState(req, res, next) {
  const state = crypto.randomBytes(32).toString("hex");
  res.cookie(COOKIE, state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 10 * 60 * 1000 });
  res.locals.oauthState = state;
  next();
}

// Reject a callback whose ?state= does not match the cookie we issued.
function verifyOAuthState(req, res, next) {
  const expected = req.cookies[COOKIE];
  const received = req.query.state;
  res.clearCookie(COOKIE);
  if (
    typeof received !== "string" ||
    !expected ||
    received.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected))
  ) {
    return res.status(400).send("Invalid OAuth state");
  }
  next();
}

module.exports = { issueOAuthState, verifyOAuthState };
