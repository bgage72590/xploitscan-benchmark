import { withWorkspace } from "@/lib/auth";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

// withWorkspace (imported) resolves the caller's session and workspace and
// returns 401 before this handler runs.
export const POST = withWorkspace(async ({ req, workspace }) => {
  const { prompt } = await req.json();
  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    messages: [{ role: "user", content: prompt }],
    maxOutputTokens: 300,
  });
  return result.toTextStreamResponse();
});
