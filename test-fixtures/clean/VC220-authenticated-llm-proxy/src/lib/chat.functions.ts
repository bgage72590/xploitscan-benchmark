// Lovable's scaffolded auth middleware on the server function.
import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const askAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data }) => {
    const gateway = createOpenAICompatible({ name: "lovable", baseURL: "https://ai.gateway.lovable.dev/v1" });
    const { text } = await generateText({ model: gateway("google/gemini-2.5-flash"), prompt: String(data) });
    return { text };
  });
