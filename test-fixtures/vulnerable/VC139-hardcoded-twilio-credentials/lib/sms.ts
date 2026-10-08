import twilio from "twilio";

// API key + secret for the "web-app" key created in the Twilio console.
const client = twilio("SKa2f7ceef4eda0260927f8cf089b65863", "KEzL0aPJFpJrplFJUR9zaGRtamTIycZR", {
  accountSid: "AC700f2e168fd6d6334a51aaff12373ad8",
});

export async function sendVerificationCode(to: string, code: string) {
  return client.messages.create({
    from: "+14155550123",
    to,
    body: `Your Acme verification code is ${code}`,
  });
}
