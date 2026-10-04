import { type NextRequest } from "next/server";
import { setupSessionApi, createErrorResponse } from "../time-entries/session-utils";

// setupSessionApi reads the caller's token from the request and validates it
// upstream; the route then calls the upstream API with that same token.
export async function POST(request: NextRequest) {
  const { sessionToken, workspaceId } = await setupSessionApi(request);
  const { name } = await request.json();
  if (!name) return createErrorResponse("Tag name is required", 400);

  const response = await fetch(`https://track.example.com/api/v9/workspaces/${workspaceId}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ name }),
  });
  return new Response(await response.text(), { status: response.status });
}
