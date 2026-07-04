// Prompt injection: user input concatenated directly into LLM message
// content via a template literal. Attacker can override instructions.
// VC198 must fire.
import OpenAI from "openai";

const openai = new OpenAI();

export async function answer(req: { body: { question: string } }) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful customer-support assistant." },
      // ↓ user-controlled input embedded in content. Classic prompt injection.
      { role: "user", content: `User asks: ${req.body.question}` },
    ],
    max_tokens: 256,
  });
  return completion.choices[0].message.content;
}
