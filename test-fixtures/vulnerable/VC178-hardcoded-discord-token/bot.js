// Discord bot client with a hardcoded token.
// Real Discord bot tokens are <user_id_b64>.<timestamp_b64>.<hmac> where
// the user-ID prefix starts with M, N, or O for IDs in the bot range.
// VC178 must fire.

import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Hardcoding the bot token gives anyone with repo access full control of
// the bot — sending messages, reading DMs, managing channels, etc.
client.login("MTI4NDc5MjUyNTAyMjk4Mzc1OQ.GxkP3a.f5bG2L4nHk9wQ7rXjMt8vYpZcSlBdNoR1eFhCgI");

client.on("ready", () => {
  console.log("Bot online");
});
