// Notification service with three hardcoded API keys baked in source.
// Each one is a separate VC001/VC031-class secret leak.

module.exports = {
  sendgrid: {
    apiKey: "SG.RealLookingKey0123456789abcdefghijklmnopqrstu_v",
  },
  twilio: {
    accountSid: "AC1234567890abcdef1234567890abcdef",
    authToken: "abcdef1234567890abcdef1234567890",
  },
  slack: {
    webhookUrl: "https://hooks.slack.com/services/T0123/B45678/secret-webhook-token-here",
  },
};
