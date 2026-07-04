// Password-reset controller. Generates a token with Math.random (VC034)
// and embeds it in the URL it emails to the user (VC088).

const { sendEmail } = require("./email");

function generateResetToken() {
  let t = "";
  for (let i = 0; i < 24; i++) t += Math.floor(Math.random() * 16).toString(16);
  return t;
}

async function requestReset(req, res) {
  const user = await db.findUserByEmail(req.body.email);
  if (!user) return res.json({ ok: true });
  const token = generateResetToken();
  await db.saveResetToken(user.id, token);
  const link = `https://app.example.com/reset?token=${token}&userId=${user.id}`;
  await sendEmail(user.email, "Reset your password", `Click: ${link}`);
  res.json({ ok: true });
}

module.exports = { requestReset };
