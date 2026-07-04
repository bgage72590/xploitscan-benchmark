// Model output is constrained to a JSON schema and used as data, not code —
// never passed to eval/exec/SQL/fs. VC207 must NOT fire.
import OpenAI from "openai";
const client = new OpenAI();

export async function classify(text: string) {
  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: text }],
    response_format: { type: "json_object" },
  });
  const out = completion.choices[0].message.content ?? "{}";
  const parsed = JSON.parse(out);
  const allowed = ["spam", "ham", "unknown"];
  // Used purely as data, validated against an allowlist.
  return allowed.includes(parsed.label) ? parsed.label : "unknown";
}
