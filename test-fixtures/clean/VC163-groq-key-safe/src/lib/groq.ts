// Browser side: talks to our own /api/chat proxy, never to Groq directly.
export async function ask(prompt: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
  const { reply } = await res.json();
  return reply;
}
