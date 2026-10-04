// Bring-your-own-key: the user pastes THEIR key into the settings panel and it
// is kept in their own browser. dangerouslyAllowBrowser exists for exactly
// this — the key belongs to the person typing it, not to the app. VC217 must
// not fire on any shape below.
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export function clientFor(userKey: string) {
  return new OpenAI({ apiKey: userKey, dangerouslyAllowBrowser: true });
}

export function anthropicFromSettings() {
  const apiKey = localStorage.getItem("anthropicKey") ?? "";
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
}

export function settingsPanelClient(settings: { apiKey: string }) {
  return new OpenAI({ apiKey: settings.apiKey, dangerouslyAllowBrowser: true });
}

// A local model server: the "key" is a dummy that Ollama ignores.
export const local = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
  dangerouslyAllowBrowser: true,
});

// The app's own proxy holds the real key server-side.
export const proxied = new OpenAI({
  baseURL: "/api/openai",
  apiKey: import.meta.env.VITE_PROXY_CLIENT_ID,
  dangerouslyAllowBrowser: true,
});

// Raw Anthropic call with a user-supplied key.
export async function ask(apiKey: string, prompt: string) {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({ prompt }),
  });
}
