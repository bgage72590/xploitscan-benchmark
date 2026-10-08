// Vite + React chat widget that calls Groq straight from the browser.
// The key is in the client bundle, so every visitor can read it.
// This should trigger VC163 (Hardcoded Groq API Key).
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "gsk_FAKE0000FAKE0000FAKE0000FAKE0000FAKE0000FAKE0000FAKE",
  dangerouslyAllowBrowser: true,
});

export async function ask(prompt: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });
  return completion.choices[0]?.message?.content ?? "";
}
