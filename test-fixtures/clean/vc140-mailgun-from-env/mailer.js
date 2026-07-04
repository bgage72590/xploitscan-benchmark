// Mailgun client keyed from an environment variable — the safe pattern.
// VC140 (hardcoded Mailgun key, key-<32 hex>) must NOT fire here.
import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY ?? "",
});

export async function sendWelcome(to) {
  return mg.messages.create("mg.example.com", {
    from: "Example <hello@example.com>",
    to,
    subject: "Welcome",
    text: "Thanks for signing up.",
  });
}
