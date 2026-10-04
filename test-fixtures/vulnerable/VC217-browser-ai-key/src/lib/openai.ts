// A Vite app (the shape Lovable and Bolt generate) calling OpenAI straight
// from the browser. The key VALUE lives in the hosting dashboard, not the
// repo, so no literal-key rule can see it — but Vite replaces
// import.meta.env.VITE_OPENAI_API_KEY with the key itself at build time, and
// the deployed JavaScript carries it. VC217 must fire.
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function summarize(text: string) {
  const res = await openai.chat.completions.create({
    model: import.meta.env.VITE_OPENAI_MODEL,
    messages: [{ role: "user", content: `Summarize: ${text}` }],
    max_tokens: 300,
  });
  return res.choices[0].message.content;
}
