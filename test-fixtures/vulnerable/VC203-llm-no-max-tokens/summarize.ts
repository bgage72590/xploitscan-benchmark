// LLM call with no max_tokens cap. Attacker-crafted input that maximizes
// output length runs up the bill. VC203 must fire.
import OpenAI from "openai";

const openai = new OpenAI();

export async function summarize(text: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "Summarize the user's text concisely." },
      { role: "user", content: text },
    ],
    // max_tokens omitted — no cap on output length
  });
  return completion.choices[0].message.content;
}
