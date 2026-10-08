// Together AI client keyed from the server environment. VC162 must NOT fire.
import Together from "together-ai";

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function chat(messages: { role: "user" | "assistant"; content: string }[]) {
  const completion = await together.chat.completions.create({
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    messages,
    max_tokens: 512,
  });
  return completion.choices[0]?.message?.content ?? "";
}
