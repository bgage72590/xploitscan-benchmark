import plivo from "plivo";

// Sends one-time login codes and order updates by SMS.
// Credentials come from PLIVO_AUTH_ID / PLIVO_AUTH_TOKEN in the environment.
const client = new plivo.Client(process.env.PLIVO_AUTH_ID, process.env.PLIVO_AUTH_TOKEN);

const SENDER_NUMBER = "+14155550123";

export async function sendOtp(phone: string, code: string) {
  return client.messages.create({
    src: SENDER_NUMBER,
    dst: phone,
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
  });
}
