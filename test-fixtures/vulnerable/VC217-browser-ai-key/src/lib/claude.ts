// Raw fetch to Anthropic from the browser. The direct-browser-access header is
// Anthropic's opt-in for exactly this, and the x-api-key comes from a VITE_
// variable that Vite builds into the bundle. VC217 must fire.
export async function ask(prompt: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": import.meta.env.VITE_CLAUDE_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: "claude-sonnet", max_tokens: 512, messages: [{ role: "user", content: prompt }] }),
  });
  return res.json();
}
