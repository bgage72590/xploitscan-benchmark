// Client configuration module with a hardcoded Anthropic API key.
// Real keys have the format sk-ant-api03-... — VC132 must fire.

import Anthropic from "@anthropic-ai/sdk";

// Committing the key like this leaks it to anyone with repo access and
// also bakes it into the shipped bundle if this file is client-imported.
const client = new Anthropic({
  apiKey: "sk-ant-api03-KxM4tH8xQ2v7JbR9nLpWfS6cZaX3Y1oE5iAuTvBdN0qMgHhDjFrUlVkOcPnWeRxSzYtQaXiMjNbKoVpSdEgWtA9cRuKhMiFeDqTgPwNxHkBjVyScZlLpOaIvRrGmUtQzXdYfCbEnWoJkAsTiHdFgBn",
});

export default client;
