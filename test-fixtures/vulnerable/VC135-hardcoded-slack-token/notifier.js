// Slack notifier with a hardcoded bot token (xoxb-...). Real bot tokens
// start with xoxb-, user tokens with xoxp-, app tokens with xoxa-, session
// tokens with xoxs-. Leaking any of them lets an attacker post to your
// workspace, read channel history, exfiltrate files. VC135 must fire.

import { WebClient } from "@slack/web-api";

const slack = new WebClient(
  "xoxb-1234567890-1234567890123-abcdefghijklmnopqrstuvwx"
);

export async function notifyDeploy(channel, text) {
  await slack.chat.postMessage({ channel, text });
}
