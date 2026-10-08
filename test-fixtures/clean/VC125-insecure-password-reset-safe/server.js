const express = require("express");
const crypto = require("crypto");
const { requireAuth } = require("./middleware/auth");
const { User, Room, PasswordReset } = require("./models");
const { sendResetEmail } = require("./email");

const app = express();
app.use(express.json());

const GENERIC = {
  message: "Check your inbox. If no account exists for that address, nothing will be sent.",
};

// POST /api/auth/forgot-password
app.post("/api/auth/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    console.log("Forgot password: no user found for", req.body.email);
    return res.json(GENERIC); // no user found: same response, so emails can't be enumerated
  }

  const token = crypto.randomBytes(32).toString("hex");
  await PasswordReset.create({
    userId: user.id,
    tokenHash: crypto.createHash("sha256").update(token).digest("hex"),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
  });
  await sendResetEmail(user.email, token);
  res.json(GENERIC);
});

// Game rooms: a short code players type to join a lobby, not a credential.
app.post("/api/rooms", requireAuth, async (req, res) => {
  const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const room = await Room.create({ code: roomCode, host: req.user.id });
  res.json(room);
});

app.listen(process.env.PORT || 3000);
