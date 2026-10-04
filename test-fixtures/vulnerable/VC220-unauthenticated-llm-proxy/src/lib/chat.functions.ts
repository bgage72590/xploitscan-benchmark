// TanStack Start server function calling the AI gateway through the Vercel
// AI SDK, with no auth middleware. Server functions are public endpoints.
import { createServerFn } from "@tanstack/react-start";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { z } from "zod";

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ prompt: z.string().max(4000) }).parse(d))
  .handler(async ({ data }) => {
    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": process.env.LOVABLE_API_KEY ?? "" },
    });
    const { text } = await generateText({ model: gateway("google/gemini-2.5-flash"), prompt: data.prompt });
    return { text };
  });
