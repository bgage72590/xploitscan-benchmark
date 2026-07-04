// Resend email client with a hardcoded API key.
// Real Resend keys have the format re_<22 alphanumeric chars> — VC166 must fire.

import { Resend } from "resend";

// Committing the key like this leaks it to anyone with repo access and
// also bakes it into the shipped bundle if this file is client-imported.
const resend = new Resend("re_KxM4tH8xQ2v7JbR9nLpWfS6c");

export async function sendWelcomeEmail(to: string) {
  await resend.emails.send({
    from: "noreply@example.com",
    to,
    subject: "Welcome",
    html: "<p>Hello!</p>",
  });
}
