// Shared Plivo settings for the SMS webhook signature check and the
// outbound reminders cron. Secrets are read from the environment.
module.exports = {
  PLIVO_AUTH_ID: process.env.PLIVO_AUTH_ID,
  PLIVO_AUTH_TOKEN: process.env.PLIVO_AUTH_TOKEN,
  PLIVO_SENDER: "+14155550123",
};
