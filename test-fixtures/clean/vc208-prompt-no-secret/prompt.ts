// The secret stays in SDK config / headers — only non-sensitive data is in the
// prompt. VC208 must NOT fire. (The Authorization header interpolation is not
// prompt content.)
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function ask(userName: string, question: string) {
  const messages = [
    { role: "system", content: `You are a helpful assistant for ${userName}.` },
    { role: "user", content: question },
  ];
  return client.chat.completions.create({ model: "gpt-4o", messages });
}
