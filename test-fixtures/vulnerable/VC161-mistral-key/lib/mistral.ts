// Shared Mistral client for the Next.js app's server actions. The key is
// passed inline to the SDK constructor — the shape the Mistral quickstart
// uses, with the env lookup replaced by the literal key.
import { Mistral } from "@mistralai/mistralai";

export const mistral = new Mistral({
  apiKey: "FAKE0000FAKE0000FAKE0000FAKE0000",
});

export async function summarize(text: string): Promise<string> {
  const res = await mistral.chat.complete({
    model: "mistral-large-latest",
    messages: [
      { role: "system", content: "Summarize the user's text in three bullet points." },
      { role: "user", content: text },
    ],
  });
  const content = res.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : "";
}
