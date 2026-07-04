// VC203 regression: inline `// max_tokens` comment after a real arg.
// The original PR #309 comment-stripping regex only handled start-of-line
// comments, missing inline ones — so this would falsely satisfy the cap
// check. Macroscope flagged this. VC203 must still fire here.
import OpenAI from "openai";

const openai = new OpenAI();

export async function summarize(text: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4", // max_tokens: 1000  ← inline comment, NOT a real cap
    messages: [
      { role: "system", content: "Summarize concisely." },
      { role: "user", content: text },
    ],
  });
  return completion.choices[0].message.content;
}
