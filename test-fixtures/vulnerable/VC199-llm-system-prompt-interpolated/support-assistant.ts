// Per-tenant support assistant. The tenant's display name and their
// self-serve "custom instructions" field are interpolated into the system
// prompt, so a tenant admin can rewrite the assistant's rules.
// Fixture for VC199 (system prompt constructed with non-literal content).

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Tenant {
  name: string;
  customInstructions: string;
}

export async function askSupportAssistant(tenant: Tenant, question: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: `You are the support assistant for ${tenant.name}. Additional policy: ${tenant.customInstructions}` },
      { role: "user", content: question },
    ],
  });

  return completion.choices[0]?.message?.content ?? "";
}
