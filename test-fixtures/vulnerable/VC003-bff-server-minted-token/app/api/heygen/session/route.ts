const API_BASE = "https://api.example.com";

async function createSessionToken(): Promise<string> {
  const apiKey = process.env.STREAMING_API_KEY;
  if (!apiKey) throw new Error("STREAMING_API_KEY not configured");
  const response = await fetch(`${API_BASE}/v1/streaming.create_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
  });
  const data = await response.json();
  return data.token as string;
}

// Anyone can call this: the session token is minted by the SERVER with its own
// API key, so the outbound Bearer header says nothing about the caller.
export async function POST(req: Request) {
  const { avatar_id } = await req.json();
  const sessionToken = await createSessionToken();
  const response = await fetch(`${API_BASE}/v1/streaming.new`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
    body: JSON.stringify({ avatar_id }),
  });
  return Response.json(await response.json());
}
