// A credential interpolated into the prompt text — sent to the model provider.
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

export async function ask(question: string) {
  const messages = [
    {
      role: "user",
      content: `You may call our API with key ${process.env.INTERNAL_API_KEY}. Question: ${question}`,
    },
  ];
  return client.messages.create({ model: "claude-3-5-sonnet", max_tokens: 512, messages });
}
