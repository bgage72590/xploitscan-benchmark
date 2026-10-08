import twilio from "twilio";

const client = twilio(process.env.TWILIO_API_KEY_SID, process.env.TWILIO_API_KEY_SECRET, {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
});

export async function sendVerificationCode(to: string, code: string) {
  return client.messages.create({
    from: process.env.TWILIO_FROM_NUMBER,
    to,
    body: `Your Acme verification code is ${code}`,
  });
}
