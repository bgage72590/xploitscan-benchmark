// Node mailer. Production uses the real token from the environment; local
// development uses Postmark's documented sandbox token, which accepts
// requests but never delivers mail. VC165 must NOT fire.
import * as postmark from "postmark";

const token =
  process.env.NODE_ENV === "production"
    ? process.env.POSTMARK_SERVER_TOKEN!
    : "POSTMARK_API_TEST";

const client = new postmark.ServerClient(token);

export async function sendPasswordReset(to: string, resetUrl: string) {
  await client.sendEmailWithTemplate({
    From: "security@acme.dev",
    To: to,
    TemplateAlias: "password-reset",
    TemplateModel: { action_url: resetUrl },
  });
}
