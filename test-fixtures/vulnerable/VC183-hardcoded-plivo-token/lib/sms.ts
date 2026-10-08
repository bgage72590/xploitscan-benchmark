import plivo from "plivo";

// Sends one-time login codes and order updates by SMS.
const client = new plivo.Client("MA9JHDFYB7ACT1JNXYIX", "7Fltc1bLG800ANBNOJxpaF5ZxqrW9RkUVeMFuKkx");

const SENDER_NUMBER = "+14155550123";

export async function sendOtp(phone: string, code: string) {
  return client.messages.create({
    src: SENDER_NUMBER,
    dst: phone,
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
  });
}
