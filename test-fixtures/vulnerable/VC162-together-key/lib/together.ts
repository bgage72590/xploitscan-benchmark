// Together AI client used by the chat route. The key (current tgp_v1_
// format) is passed straight to the SDK constructor.
// This should trigger VC162 (Hardcoded Together AI API Key).
import Together from "together-ai";

const together = new Together({
  apiKey: "tgp_v1_FAKE0000FAKE0000FAKE0000FAKE0000FAKE0000FAK",
});

export async function chat(messages: { role: "user" | "assistant"; content: string }[]) {
  const completion = await together.chat.completions.create({
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    messages,
    max_tokens: 512,
  });
  return completion.choices[0]?.message?.content ?? "";
}
