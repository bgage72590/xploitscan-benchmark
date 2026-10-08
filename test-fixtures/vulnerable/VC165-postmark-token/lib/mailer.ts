// Node mailer for password-reset emails. The server token is passed inline
// to the Postmark SDK constructor.
import * as postmark from "postmark";

const client = new postmark.ServerClient("00000000-0000-4000-8000-0000deadbeef");

export async function sendPasswordReset(to: string, resetUrl: string) {
  await client.sendEmailWithTemplate({
    From: "security@acme.dev",
    To: to,
    TemplateAlias: "password-reset",
    TemplateModel: { action_url: resetUrl },
  });
}
